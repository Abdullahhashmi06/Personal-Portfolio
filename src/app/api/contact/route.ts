import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

/* ──────────────────────────────────────────────────────────
 *  Gmail API – sends contact-form submissions to your inbox.
 *
 *  Required env vars (NEVER commit actual values):
 *    GOOGLE_CLIENT_ID
 *    GOOGLE_CLIENT_SECRET
 *    GOOGLE_REFRESH_TOKEN
 *    CONTACT_EMAIL          ← the Gmail address that receives messages
 * ────────────────────────────────────────────────────────── */

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // redirect URI is only needed for the initial auth flow, not for
    // sending mail, but the constructor requires it.
    "https://developers.google.com/oauthplayground"
  );
}

/* ── rate-limit / spam guard (very lightweight, in-memory) ── */
const recentIPs = new Map<string, number>();
const RATE_LIMIT_MS = 60_000; // 1 submission per minute per IP

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const last = recentIPs.get(ip);
  if (last && now - last < RATE_LIMIT_MS) return true;
  recentIPs.set(ip, now);
  // prune entries older than 5 min
  for (const [k, v] of recentIPs) {
    if (now - v > 300_000) recentIPs.delete(k);
  }
  return false;
}

/* ── very basic content-length / spam heuristics ── */
const MAX_MESSAGE_LENGTH = 5_000;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 30;

function sanitize(input: string, max: number): string {
  return input.trim().slice(0, max);
}

/* ── build a MIME message and base64url-encode it ── */
function buildMimeMessage({
  fromName,
  fromEmail,
  phone,
  message,
}: {
  fromName: string;
  fromEmail: string;
  phone: string;
  message: string;
}): string {
  const to = process.env.CONTACT_EMAIL;
  const subject = `New Portfolio Contact — ${fromName}`;

  const phoneLine = phone ? `Phone: ${phone}\n` : "";

  const body = [
    `Name: ${fromName}`,
    `Email: ${fromEmail}`,
    phoneLine,
    `Message:`,
    message,
  ]
    .join("\n")
    .replace(/\r/g, "");

  // MIME headers + body
  const mime = [
    `To: ${to}`,
    `From: "Portfolio Contact" <${to}>`,
    `Reply-To: ${fromName} <${fromEmail}>`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    `Content-Transfer-Encoding: 7bit`,
    ``,
    body,
  ].join("\r\n");

  // base64url encode (Gmail API requirement)
  return Buffer.from(mime)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/* ── POST /api/contact ── */
export async function POST(req: NextRequest) {
  try {
    /* --- rate limit --- */
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    /* --- parse body --- */
    const body = await req.json();
    const name = sanitize(String(body.name || ""), MAX_NAME_LENGTH);
    const email = sanitize(String(body.email || ""), MAX_EMAIL_LENGTH);
    const phone = sanitize(String(body.phone || ""), MAX_PHONE_LENGTH);
    const message = sanitize(String(body.message || ""), MAX_MESSAGE_LENGTH);

    /* --- verify reCAPTCHA --- */
    const captchaToken = String(body.captchaToken || "");
    if (!captchaToken) {
      return NextResponse.json(
        { error: "CAPTCHA verification is required." },
        { status: 400 }
      );
    }

    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error("Missing RECAPTCHA_SECRET_KEY environment variable.");
      return NextResponse.json(
        { error: "CAPTCHA service is not configured." },
        { status: 503 }
      );
    }

    const captchaVerifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: recaptchaSecret,
          response: captchaToken,
          remoteip: ip,
        }),
      }
    );

    const captchaVerifyData = await captchaVerifyRes.json();

    if (!captchaVerifyData.success) {
      return NextResponse.json(
        { error: "CAPTCHA verification failed. Please try again." },
        { status: 400 }
      );
    }

    /* --- validate --- */
    const errors: Record<string, string> = {};
    if (!name) errors.name = "Name is required.";
    if (!email) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message) errors.message = "Message is required.";

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 });
    }

    /* --- basic spam heuristics --- */
    const spamTriggers = [
      /viagra/i,
      /casino/i,
      /crypto.*invest/i,
      /click here now/i,
      /buy now/i,
      /free money/i,
    ];
    if (spamTriggers.some((re) => re.test(message) || re.test(name))) {
      return NextResponse.json(
        { error: "Message could not be processed." },
        { status: 400 }
      );
    }

    /* --- check env vars --- */
    if (
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_CLIENT_SECRET ||
      !process.env.GOOGLE_REFRESH_TOKEN ||
      !process.env.CONTACT_EMAIL
    ) {
      console.error("Missing Gmail API environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured yet." },
        { status: 503 }
      );
    }

    /* --- send via Gmail API --- */
    const oauth2 = getOAuth2Client();
    oauth2.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

    const gmail = google.gmail({ version: "v1", auth: oauth2 });

    const raw = buildMimeMessage({
      fromName: name,
      fromEmail: email,
      phone,
      message,
    });

    await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
