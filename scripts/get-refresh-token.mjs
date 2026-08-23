/**
 * One-time setup script to generate a Google OAuth refresh token for the
 * portfolio contact form's Gmail API integration.
 *
 * PREREQUISITES:
 *   1. Create a Google Cloud project at https://console.cloud.google.com
 *   2. Enable the Gmail API (APIs & Services → Library → search "Gmail API")
 *   3. Create OAuth 2.0 credentials:
 *      - Go to APIs & Services → Credentials
 *      - Click "+ Create Credentials" → OAuth client ID
 *      - Application type: Web application
 *      - Name: Portfolio Contact Form
 *      - Authorized redirect URIs: add exactly:
 *          https://developers.google.com/oauthplayground
 *   4. Copy the Client ID and Client Secret into .env.local
 *   5. Run:  node scripts/get-refresh-token.mjs
 *
 * The script will print a URL to visit. After authorizing, paste the
 * authorization code back into the terminal. The refresh token will be
 * printed and should be added to .env.local as GOOGLE_REFRESH_TOKEN.
 */

import { google } from "googleapis";
import readline from "readline";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Load .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "..", ".env.local") });

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n❌  Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET in .env.local\n" +
      "   Copy .env.local.example to .env.local and fill in the values first.\n"
  );
  process.exit(1);
}

const REDIRECT_URI = "https://developers.google.com/oauthplayground";

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Scopes needed to send email via Gmail API
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent", // forces refresh_token to be returned
});

console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("  Google OAuth Setup — Portfolio Contact Form");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
console.log("1. Open this URL in your browser:\n");
console.log(`   ${authUrl}\n`);
console.log("2. Sign in with the Google account that should");
console.log("   RECEIVE contact form submissions.\n");
console.log("3. Grant permission to send emails on your behalf.\n");
console.log("4. Copy the authorization code from the redirect page.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the authorization code here: ", async (code) => {
  rl.close();

  try {
    const { tokens } = await oauth2Client.getToken(code.trim());
    console.log("\n✅  Success! Your refresh token:\n");
    console.log(`   GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
    console.log("Add this to your .env.local file.\n");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (err) {
    console.error("\n❌  Failed to exchange authorization code:", err.message);
    console.error("   Make sure you copied the full code correctly.\n");
    process.exit(1);
  }
});
