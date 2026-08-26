"use client";

import { useState, useTransition, useCallback } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Loader2 } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { socials } from "@/data/socials";
import ReCAPTCHA from "react-google-recaptcha-v2";
import { cn, EASE } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

interface FormFields {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmitStatus = "idle" | "sending" | "success" | "error";

declare global {
  interface Window {
    grecaptcha?: {
      reset: (widgetId?: number) => void;
    };
  }
}

const inputClasses = cn(
  "w-full rounded-xl border border-line bg-white/[0.03] px-5 py-3.5 text-sm text-fg",
  "placeholder:text-faint/60 outline-none transition-all duration-300",
  "focus:border-accent/50 focus:bg-white/[0.05] focus:ring-1 focus:ring-accent/20",
  "hover:border-line-strong"
);

const labelClasses = "mb-2 block text-sm font-medium text-muted";

export default function ContactPage() {
  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [serverError, setServerError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState("");

  const onCaptchaChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
    if (token) setCaptchaError("");
  }, []);

  const onCaptchaExpired = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!fields.name.trim()) e.name = "Name is required.";
    if (!fields.email.trim()) {
      e.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      e.email = "Please enter a valid email address.";
    }
    if (!fields.message.trim()) e.message = "Message is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    if (!captchaToken) {
      setCaptchaError("Please complete the CAPTCHA to continue.");
      return;
    }

    setStatus("sending");
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...fields, captchaToken }),
        });

        const data = await res.json();

        if (!res.ok) {
          // Reset CAPTCHA on error so the user can retry
          if (window.grecaptcha) {
            window.grecaptcha.reset();
          }
          setCaptchaToken(null);

          if (data.errors) {
            setErrors(data.errors);
            setStatus("idle");
          } else {
            setServerError(data.error || "Something went wrong.");
            setStatus("error");
          }
          return;
        }

        // Reset CAPTCHA on success
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaToken(null);

        setStatus("success");
      } catch {
        setServerError("Network error. Please check your connection and try again.");
        setStatus("error");
      }
    });
  };

  const handleChange = (
    field: keyof FormFields,
    value: string
  ) => {
    setFields((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <main className="relative min-h-screen pb-24 pt-28 sm:pb-32 sm:pt-32">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[min(900px,100vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgb(154_160_255/0.08),transparent_65%)]"
      />

      <Container>
        {/* Back link */}
        <motion.a
          href="/"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="group mb-12 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <span className="transition-transform duration-300 group-hover:-translate-x-1">
            ←
          </span>
          Back to home
        </motion.a>

        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-start lg:gap-20">
          {/* Left: heading + info */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent"
            >
              Contact
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
              className="mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              Let&apos;s work
              <br />
              together.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
              className="mt-5 max-w-md text-base leading-relaxed text-muted sm:text-lg"
            >
              Have a project, idea, opportunity, or just want to say hello?
              Send me a message.
            </motion.p>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
              className="mt-10 flex items-center gap-3"
            >
              <a
                href={socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.02] text-muted transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg"
              >
                <GithubIcon className="size-[18px]" />
              </a>
              <a
                href={socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.02] text-muted transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg"
              >
                <LinkedinIcon className="size-[18px]" />
              </a>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {status === "success" ? (
              <div className="rounded-2xl border border-line bg-white/[0.02] p-8 sm:p-10">
                <div className="flex flex-col items-center text-center">
                  <div className="grid size-14 place-items-center rounded-full border border-accent/30 bg-accent/10">
                    <Check className="size-6 text-accent" />
                  </div>
                  <h2 className="mt-5 text-xl font-semibold tracking-tight text-fg">
                    Message sent successfully.
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setServerError("");
                      setCaptchaToken(null);
                      setCaptchaError("");
                      setFields({ name: "", email: "", phone: "", message: "" });
                      if (window.grecaptcha) {
                        window.grecaptcha.reset();
                      }
                    }}
                    className="mt-6 text-sm text-accent transition-colors hover:text-fg"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="rounded-2xl border border-line bg-white/[0.02] p-6 sm:p-8"
              >
                {/* Name */}
                <Reveal delay={0.05}>
                  <div className="mb-5">
                    <label htmlFor="name" className={labelClasses}>
                      Name <span className="text-accent">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={fields.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className={cn(inputClasses, errors.name && "border-red-400/60 focus:border-red-400/80 focus:ring-red-400/20")}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-red-400/80">{errors.name}</p>
                    )}
                  </div>
                </Reveal>

                {/* Email */}
                <Reveal delay={0.1}>
                  <div className="mb-5">
                    <label htmlFor="email" className={labelClasses}>
                      Email <span className="text-accent">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={fields.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={cn(inputClasses, errors.email && "border-red-400/60 focus:border-red-400/80 focus:ring-red-400/20")}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-red-400/80">{errors.email}</p>
                    )}
                  </div>
                </Reveal>

                {/* Phone */}
                <Reveal delay={0.15}>
                  <div className="mb-5">
                    <label htmlFor="phone" className={labelClasses}>
                      Phone <span className="text-faint">(optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+92 ..."
                      value={fields.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={inputClasses}
                    />
                  </div>
                </Reveal>

                {/* Message */}
                <Reveal delay={0.2}>
                  <div className="mb-6">
                    <label htmlFor="message" className={labelClasses}>
                      Message <span className="text-accent">*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell me about your project, idea, or opportunity..."
                      value={fields.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      className={cn(inputClasses, "resize-none", errors.message && "border-red-400/60 focus:border-red-400/80 focus:ring-red-400/20")}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-400/80">{errors.message}</p>
                    )}
                  </div>
                </Reveal>

                {/* Server error */}
                {status === "error" && serverError && (
                  <div className="mb-5 rounded-xl border border-red-400/30 bg-red-400/5 px-4 py-3 text-sm text-red-400/90">
                    {serverError}
                  </div>
                )}

                {/* CAPTCHA */}
                <Reveal delay={0.22}>
                  <div className="mb-5">
                    <div className="flex justify-center">
                      <ReCAPTCHA
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                        onChange={onCaptchaChange}
                        onExpired={onCaptchaExpired}
                        theme="dark"
                      />
                    </div>
                    {captchaError && (
                      <p className="mt-1.5 text-center text-xs text-red-400/80">{captchaError}</p>
                    )}
                  </div>
                </Reveal>

                {/* Submit */}
                <Reveal delay={0.25}>
                  <button
                    type="submit"
                    disabled={isPending || !captchaToken}
                    className={cn(
                      "group flex w-full items-center justify-center gap-2.5 rounded-xl bg-fg px-6 py-3.5 text-sm font-medium text-ink transition-all duration-300",
                      "hover:bg-white focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
                      "disabled:pointer-events-none disabled:opacity-60"
                    )}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </>
                    )}
                  </button>
                </Reveal>
              </form>
            )}
          </motion.div>
        </div>
      </Container>
    </main>
  );
}
