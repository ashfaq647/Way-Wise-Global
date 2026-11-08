"use client";

import { useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import FieldError from "@/components/admin/FieldError";
import Notice from "@/components/admin/Notice";
import PasswordInput from "@/components/admin/PasswordInput";
import { labelClass, newPasswordError, serverPasswordError, waitText } from "@/components/admin/authForm";
import { buttonPrimary } from "@/components/admin/ui";
import { PASSWORD_MIN_LENGTH } from "@/lib/auth/password-rules";

// Changes the admin password through Better Auth (POST /api/auth/change-password).
// Better Auth checks the session, verifies the current password, checks the new password's
// length, saves its hash and, with revokeOtherSessions, deletes every session and starts a
// new one for this browser (new cookie in the response): this browser stays signed in,
// every other device is signed out. Attempts are rate limited (lib/auth/auth.js).
// The quick checks below are only for faster feedback. Passwords are never logged or kept
// after sending: the form is cleared on success.
export default function ChangePasswordForm({ email }) {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (pending) return;
    const data = new FormData(e.currentTarget);
    const currentPassword = String(data.get("currentPassword") ?? "");
    const newPassword = String(data.get("newPassword") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");

    const next = {};
    if (!currentPassword) next.currentPassword = "Enter your current password.";
    const newProblem = newPasswordError(newPassword);
    if (newProblem) next.newPassword = newProblem;
    else if (currentPassword && newPassword === currentPassword) next.newPassword = "Choose a password different from the current one.";
    if (!confirmPassword) next.confirmPassword = "Repeat the new password.";
    else if (!newProblem && confirmPassword !== newPassword) next.confirmPassword = "The passwords don't match.";

    setErrors(next);
    setNotice("");
    setSuccess(false);
    if (Object.keys(next).length) return;

    setPending(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ currentPassword, newPassword, revokeOtherSessions: true }),
      });

      if (res.ok) {
        formRef.current?.reset();
        setSuccess(true);
      } else if (res.status === 401) {
        // the session ended (signed out elsewhere or expired): sign in again
        window.location.replace("/admin/login");
        return;
      } else if (res.status === 429) {
        setNotice(`Too many attempts. Please try again in ${waitText(Number(res.headers.get("X-Retry-After")))}.`);
      } else {
        const code = res.status === 400 ? (await res.json().catch(() => null))?.code : null;
        if (code === "INVALID_PASSWORD") setErrors({ currentPassword: "The current password is incorrect." });
        else if (serverPasswordError(code)) setErrors({ newPassword: serverPasswordError(code) });
        else setNotice("The password could not be changed. Please try again.");
      }
    } catch {
      setNotice("Could not reach the server. Check your connection and try again.");
    }
    setPending(false);
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="flex max-w-[480px] flex-col gap-[20px]">
      {/* lets password managers save the new password for the right account */}
      <input type="text" name="username" autoComplete="username" value={email} readOnly hidden />

      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>Current password</span>
        <PasswordInput
          name="currentPassword"
          autoComplete="current-password"
          placeholder="Enter your current password"
          error={errors.currentPassword}
          errorId="change-current-error"
        />
        {errors.currentPassword && <FieldError id="change-current-error">{errors.currentPassword}</FieldError>}
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>New password</span>
        <PasswordInput
          name="newPassword"
          autoComplete="new-password"
          placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
          error={errors.newPassword}
          errorId="change-new-error"
        />
        {errors.newPassword && <FieldError id="change-new-error">{errors.newPassword}</FieldError>}
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className={labelClass}>Confirm new password</span>
        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Enter the new password again"
          error={errors.confirmPassword}
          errorId="change-confirm-error"
        />
        {errors.confirmPassword && <FieldError id="change-confirm-error">{errors.confirmPassword}</FieldError>}
      </label>

      <div aria-live="polite" className="empty:hidden">
        {success && (
          <Notice variant="info" title="Password changed.">
            You stay signed in here. Every other device that was signed in to the admin panel has been signed out.
          </Notice>
        )}
        {notice && <Notice variant="error">{notice}</Notice>}
        {Object.keys(errors).length > 0 && <Notice variant="error">Please fix the highlighted fields.</Notice>}
      </div>

      <div>
        <button type="submit" aria-busy={pending ? "true" : undefined} className={`${buttonPrimary} aria-busy:cursor-wait`}>
          {pending && <LoaderCircle className="size-[16px] animate-spin motion-reduce:animate-none" aria-hidden />}
          Change Password
        </button>
      </div>
    </form>
  );
}
