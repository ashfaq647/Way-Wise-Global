"use client";

import { useState } from "react";
import localFont from "next/font/local";
import { ArrowRight, CircleAlert, Eye, EyeOff, LoaderCircle, Lock, Mail } from "lucide-react";
import Notice from "@/components/admin/Notice";
import { focusRing } from "@/components/admin/ui";

// Same semi-bold Oxanium file as the Partner With Us form
const oxaniumSemiBold = localFont({ src: "../../app/fonts/oxanium-semibold-latin.woff2", weight: "600" });

// Login fields: lighter placeholder, red hover/focus ring in the brand red, red border + ring
// when invalid.
const inputClass =
  "h-[48px] w-full rounded-[8px] border border-[#3a3a3a] bg-[#0c0c0c] pl-[44px] text-[14px] text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#8b929c] hover:border-[rgba(184,1,0,0.6)] focus:border-[#b80100] focus:shadow-[0_0_0_3px_rgba(184,1,0,0.3)] aria-[invalid=true]:border-[#e00000] aria-[invalid=true]:shadow-[0_0_0_3px_rgba(224,0,0,0.18)]";
const iconClass = "pointer-events-none absolute left-[15px] top-1/2 size-[17px] -translate-y-1/2 text-[#8b929c]";
const labelClass = "text-[14px] font-medium leading-[20px] text-white";
const errorClass = "flex items-start gap-[6px] text-[13px] leading-[18px] text-[#ff4d4d]";
const errorIconClass = "mt-[2px] size-[14px] shrink-0";

// "15 minutes" / "40 seconds" for the too-many-attempts message
function waitText(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "a few minutes";
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

// Signs in through Better Auth (POST /api/auth/sign-in/email). The quick checks below are
// only for faster feedback: Better Auth validates the input again, checks the password and
// limits the number of attempts. On success the session cookie is set (httpOnly, so this
// code never sees it) and the browser goes to the dashboard.
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
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

      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>Password</span>
        <span className="relative">
          <Lock className={iconClass} aria-hidden />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={errors.password ? "true" : undefined}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            className={`${inputClass} pr-[52px]`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className={`absolute right-[4px] top-1/2 flex size-[40px] -translate-y-1/2 cursor-pointer items-center justify-center rounded-[6px] text-[#9d9d9d] transition-colors duration-200 hover:text-white ${focusRing}`}
          >
            {showPassword ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
          </button>
        </span>
        {errors.password && (
          <span id="login-password-error" className={errorClass}>
            <CircleAlert className={errorIconClass} aria-hidden />
            {errors.password}
          </span>
        )}
      </label>

      <div aria-live="polite" className="empty:hidden">
        {notice && <Notice variant="error">{notice}</Notice>}
        {Object.keys(errors).length > 0 && <Notice variant="error">Please fix the highlighted fields.</Notice>}
      </div>

      {/* Same look as the "Send partnership inquiry" button in the Partner With Us form.
          States: hover (darker red), disabled (muted, no pointer), loading (aria-busy="true":
          spinner instead of the arrow). aria-busy is set while signing in. */}
      <button
        type="submit"
        aria-busy={pending ? "true" : undefined}
        className={`${oxaniumSemiBold.className} group mt-[4px] flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#b80100] px-[16px] py-[14px] text-[15px] font-semibold leading-[24px] text-white transition-colors duration-300 hover:bg-[#9a0100] disabled:cursor-not-allowed disabled:bg-[#4a1212] disabled:text-white/60 aria-busy:cursor-wait aria-busy:bg-[#9a0100] ${focusRing}`}
      >
        LOG IN
        <LoaderCircle aria-hidden className="hidden size-[20px] animate-spin group-aria-busy:block motion-reduce:animate-none" />
        <span aria-hidden className="relative size-[24px] shrink-0 overflow-hidden group-disabled:opacity-60 group-aria-busy:hidden">
          <span className="absolute right-0 top-0 flex transition-transform duration-300 ease-out group-hover:translate-x-1/2 group-disabled:translate-x-0">
            <ArrowRight className="size-[24px]" />
            <ArrowRight className="size-[24px]" />
          </span>
        </span>
      </button>
    </form>
  );
}
