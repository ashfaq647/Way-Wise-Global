"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CircleAlert, Mail } from "lucide-react";
import AuthSubmitButton from "@/components/admin/AuthSubmitButton";
import Notice from "@/components/admin/Notice";
import {
  EMAIL_PATTERN,
  errorClass,
  errorIconClass,
  iconClass,
  inputClass,
  labelClass,
  textLinkClass,
  waitText,
} from "@/components/admin/authForm";
import { RESET_LINK_MINUTES } from "@/lib/auth/password-rules";

function BackToSignIn() {
  return (
    <Link href="/admin/login" className={`${textLinkClass} self-center px-[14px]`}>
      <ArrowLeft className="size-[14px]" aria-hidden />
      Back to sign in
    </Link>
  );
}

// Asks Better Auth (POST /api/auth/request-password-reset) to email a reset link. The
// server answers the same way whether or not the address is the admin's, so this page
// always shows the same message after a successful request and never says whether the
// address exists. Better Auth limits the number of requests (429).
export default function ForgotPasswordForm() {
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [requested, setRequested] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (pending) return;
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();

    let fieldError = "";
    if (!email) fieldError = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) fieldError = "Enter a valid email address.";
    setError(fieldError);
    setNotice("");
    if (fieldError) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setRequested(true);
      } else if (res.status === 429) {
        setNotice(`Too many requests. Please try again in ${waitText(Number(res.headers.get("X-Retry-After")))}.`);
      } else if (res.status === 400) {
        setError("Enter a valid email address.");
      } else {
        setNotice("The request could not be sent. Please try again.");
      }
    } catch {
      setNotice("Could not reach the server. Check your connection and try again.");
    }
    setPending(false);
  }

  if (requested) {
    return (
      <div className="flex flex-col gap-[20px]">
        <div role="status">
          <Notice variant="info" title="Check your email.">
            If that address belongs to the admin account, a link to reset the password is on its way. It works once and
            expires in {RESET_LINK_MINUTES} minutes. If it doesn&apos;t arrive within a few minutes, check the spam folder.
          </Notice>
        </div>
        <BackToSignIn />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[20px]">
      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>Email</span>
        <span className="relative">
          <Mail className={iconClass} aria-hidden />
          <input
            type="email"
            name="email"
            autoComplete="username"
            placeholder="you@company.com"
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? "forgot-email-error" : undefined}
            className={`${inputClass} pr-[16px]`}
          />
        </span>
        {error && (
          <span id="forgot-email-error" className={errorClass}>
            <CircleAlert className={errorIconClass} aria-hidden />
            {error}
          </span>
        )}
      </label>

      <div aria-live="polite" className="empty:hidden">
        {notice && <Notice variant="error">{notice}</Notice>}
      </div>

      <AuthSubmitButton pending={pending}>SEND RESET LINK</AuthSubmitButton>
      <BackToSignIn />
    </form>
  );
}
