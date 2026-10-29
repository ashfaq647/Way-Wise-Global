"use client";

import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import Notice from "@/components/admin/Notice";
import { fieldClass, focusRing } from "@/components/admin/ui";

const inputClass = `${fieldClass} h-[48px] pl-[44px]`;
const iconClass = "pointer-events-none absolute left-[15px] top-1/2 size-[17px] -translate-y-1/2 text-[#7a7a7a]";
const labelClass = "text-[14px] font-medium leading-[20px] text-white";
const errorClass = "text-[13px] leading-[18px] text-[#ff4d4d]";

// UI only. There is no authentication yet, so submitting checks the fields in the
// browser and then says sign-in isn't available, without sending anything anywhere.
export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    const next = {};
    if (!email) next.email = "Enter your email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    setNotice(Object.keys(next).length ? "" : "Sign-in is not available yet. Authentication will be added in the next step.");
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
            {errors.password}
          </span>
        )}
      </label>

      <div aria-live="polite" className="empty:hidden">
        {notice && <Notice variant="warning">{notice}</Notice>}
        {Object.keys(errors).length > 0 && <Notice variant="error">Please fix the highlighted fields.</Notice>}
      </div>

      {/* Same look as the "Send partnership inquiry" button in the Partner With Us form */}
      <button
        type="submit"
        className={`group mt-[4px] flex min-h-[52px] w-full cursor-pointer items-center justify-center gap-[8px] rounded-[8px] bg-[#b80100] px-[16px] py-[14px] font-oxanium text-[16px] font-bold leading-[24px] text-white transition-colors duration-300 hover:bg-[#9a0100] ${focusRing}`}
      >
        LOG IN
        <span aria-hidden className="relative size-[24px] shrink-0 overflow-hidden">
          <span className="absolute right-0 top-0 flex transition-transform duration-300 ease-out group-hover:translate-x-1/2">
            <ArrowRight className="size-[24px]" />
            <ArrowRight className="size-[24px]" />
          </span>
        </span>
      </button>
    </form>
  );
}
