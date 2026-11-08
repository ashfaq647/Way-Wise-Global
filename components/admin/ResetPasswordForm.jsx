"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthSubmitButton from "@/components/admin/AuthSubmitButton";
import FieldError from "@/components/admin/FieldError";
import Notice from "@/components/admin/Notice";
import PasswordInput from "@/components/admin/PasswordInput";
import { labelClass, newPasswordError, serverPasswordError, textLinkClass, waitText } from "@/components/admin/authForm";
import { buttonPrimary } from "@/components/admin/ui";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password-rules";

// The link was missing, invalid, expired or already used: offer a new one
function InvalidLink() {
  return (
    <div className="flex flex-col gap-[20px]">
      <div role="alert">
        <Notice variant="error" title="This reset link is invalid or has expired.">
          Links work once and expire after a short time. Request a new link to reset the password.
        </Notice>
      </div>
      <Link href="/admin/forgot-password" className={`${buttonPrimary} min-h-[52px] w-full`}>
        Request a new link
      </Link>
      <Link href="/admin/login" className={`${textLinkClass} self-center px-[14px]`}>
        <ArrowLeft className="size-[14px]" aria-hidden />
        Back to sign in
      </Link>
    </div>
  );
}

// Sets the new password with the token from the emailed link (POST /api/auth/reset-password).
// Better Auth checks the token (hashed in the database, valid once, 30 minutes), checks the
// password length again, saves the new password and deletes every session of the admin.
export default function ResetPasswordForm({ token }) {
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState(token ? "form" : "invalid"); // form | invalid | done

  async function handleSubmit(e) {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    const next = {};
    const passwordProblem = newPasswordError(newPassword);
    if (passwordProblem) next.newPassword = passwordProblem;
    if (!confirmPassword) next.confirmPassword = "Repeat the new password.";
    else if (!passwordProblem && confirmPassword !== newPassword) next.confirmPassword = "The passwords don't match.";

    setErrors(next);
    setNotice("");
    if (Object.keys(next).length) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ newPassword, token }),
      });

      if (res.ok) {
        // drop the used token from the address bar and the browser history
        window.history.replaceState(null, "", "/admin/reset-password");
        setStatus("done");
        return;
      }

      const code = res.status === 400 ? (await res.json().catch(() => null))?.code : null;
      if (code === "INVALID_TOKEN") {
        setStatus("invalid");
      } else if (serverPasswordError(code)) {
        setErrors({ newPassword: serverPasswordError(code) });
      } else if (res.status === 429) {
        setNotice(`Too many attempts. Please try again in ${waitText(Number(res.headers.get("X-Retry-After")))}.`);
      } else {
        setNotice("The password could not be changed. Please try again.");
      }
    } catch {
      setNotice("Could not reach the server. Check your connection and try again.");
    }
    setPending(false);
  }

  if (status === "invalid") return <InvalidLink />;

  if (status === "done") {
    return (
      <div className="flex flex-col gap-[20px]">
        <div role="status">
          <Notice variant="info" title="Your password has been changed.">
            For security, every device that was signed in to the admin panel has been signed out. Sign in with the new
            password.
          </Notice>
        </div>
        <Link href="/admin/login" className={`${buttonPrimary} min-h-[52px] w-full`}>
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[20px]">
      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>New password</span>
        <PasswordInput
          name="newPassword"
          autoComplete="new-password"
          placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
          error={errors.newPassword}
          errorId="reset-password-error"
        />
        {errors.newPassword && <FieldError id="reset-password-error">{errors.newPassword}</FieldError>}
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>Repeat new password</span>
        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Enter the new password again"
          error={errors.confirmPassword}
          errorId="reset-confirm-error"
        />
        {errors.confirmPassword && <FieldError id="reset-confirm-error">{errors.confirmPassword}</FieldError>}
      </label>

      <div aria-live="polite" className="empty:hidden">
        {notice && <Notice variant="error">{notice}</Notice>}
        {Object.keys(errors).length > 0 && <Notice variant="error">Please fix the highlighted fields.</Notice>}
      </div>

      <AuthSubmitButton pending={pending}>SAVE NEW PASSWORD</AuthSubmitButton>
    </form>
  );
}
