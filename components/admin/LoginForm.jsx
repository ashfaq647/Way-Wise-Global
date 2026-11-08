"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleAlert, Mail } from "lucide-react";
import AuthSubmitButton from "@/components/admin/AuthSubmitButton";
import Notice from "@/components/admin/Notice";
import PasswordInput from "@/components/admin/PasswordInput";
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

// Signs in through Better Auth (POST /api/auth/sign-in/email). The quick checks below are
// only for faster feedback: Better Auth validates the input again, checks the password and
// limits the number of attempts. On success the session cookie is set (httpOnly, so this
// code never sees it) and the browser goes to the dashboard.
export default function LoginForm() {
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next = {};
    if (!email) next.email = "Enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    setNotice("");
    if (Object.keys(next).length) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        // full navigation, so the server renders the panel with the new session cookie
        window.location.replace("/admin");
        return;
      }

      if (res.status === 429) {
        setNotice(`Too many sign-in attempts. Please try again in ${waitText(Number(res.headers.get("X-Retry-After")))}.`);
      } else if (res.status === 400 || res.status === 401) {
        setNotice("Incorrect email or password.");
      } else {
        setNotice("Sign-in failed. Please try again.");
      }
    } catch {
      setNotice("Could not reach the server. Check your connection and try again.");
    }
    setPending(false);
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
            aria-invalid={errors.email ? "true" : undefined}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className={`${inputClass} pr-[16px]`}
          />
        </span>
        {errors.email && (
          <span id="login-email-error" className={errorClass}>
            <CircleAlert className={errorIconClass} aria-hidden />
            {errors.email}
          </span>
        )}
      </label>

      <div className="flex flex-col gap-[8px]">
        {/* "Forgot password?" sits on the label row, so the card keeps its height. The
            negative margin gives the link a 44px tap target without moving anything. */}
        <div className="flex items-center justify-between gap-[12px]">
          <label htmlFor="login-password" className={labelClass}>
            Password
          </label>
          <Link href="/admin/forgot-password" className={`${textLinkClass} -my-[12px] px-[4px] text-[13px]`}>
            Forgot password?
          </Link>
        </div>
        <PasswordInput
          id="login-password"
          name="password"
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
          errorId="login-password-error"
        />
        {errors.password && (
          <span id="login-password-error" className={errorClass}>
            <CircleAlert className={errorIconClass} aria-hidden />
            {errors.password}
          </span>
        )}
      </div>

      <div aria-live="polite" className="empty:hidden">
        {notice && <Notice variant="error">{notice}</Notice>}
        {Object.keys(errors).length > 0 && <Notice variant="error">Please fix the highlighted fields.</Notice>}
      </div>

      <AuthSubmitButton pending={pending}>LOG IN</AuthSubmitButton>
    </form>
  );
}
