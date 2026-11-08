import { focusRing } from "@/components/admin/ui";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/password-rules";

// Shared by the admin password forms (LoginForm, ForgotPasswordForm, ResetPasswordForm,
// ChangePasswordForm).

// Fields: lighter placeholder, red hover/focus ring in the brand red, red border + ring
// when invalid.
export const inputClass =
  "h-[48px] w-full rounded-[8px] border border-[#3a3a3a] bg-[#0c0c0c] pl-[44px] text-[14px] text-white outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-[#8b929c] hover:border-[rgba(184,1,0,0.6)] focus:border-[#b80100] focus:shadow-[0_0_0_3px_rgba(184,1,0,0.3)] aria-[invalid=true]:border-[#e00000] aria-[invalid=true]:shadow-[0_0_0_3px_rgba(224,0,0,0.18)]";
export const iconClass = "pointer-events-none absolute left-[15px] top-1/2 size-[17px] -translate-y-1/2 text-[#8b929c]";
export const labelClass = "text-[14px] font-medium leading-[20px] text-white";
export const errorClass = "flex items-start gap-[6px] text-[13px] leading-[18px] text-[#ff4d4d]";
export const errorIconClass = "mt-[2px] size-[14px] shrink-0";

// Small text links ("Forgot password?", "Back to sign in"), 44px tap target
export const textLinkClass = `inline-flex min-h-[44px] items-center gap-[6px] rounded-[8px] text-[14px] text-[#b0b6c0] underline-offset-4 transition-colors duration-200 hover:text-white hover:underline ${focusRing}`;

// Same pattern as LoginForm's email check: quick feedback only, the server validates again
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// New-password messages, shared by the quick check below and by the server error codes
export const PASSWORD_MESSAGES = {
  required: "Enter a new password.",
  tooShort: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
  tooLong: `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer.`,
};

// New-password length check with the shared rules (lib/auth/password-rules.js), for quick
// feedback; Better Auth checks the length again on the server
export function newPasswordError(password) {
  if (!password) return PASSWORD_MESSAGES.required;
  if (password.length < PASSWORD_MIN_LENGTH) return PASSWORD_MESSAGES.tooShort;
  if (password.length > PASSWORD_MAX_LENGTH) return PASSWORD_MESSAGES.tooLong;
  return "";
}

// Message for Better Auth's password-length error codes ("" for any other code)
export function serverPasswordError(code) {
  if (code === "PASSWORD_TOO_SHORT") return PASSWORD_MESSAGES.tooShort;
  if (code === "PASSWORD_TOO_LONG") return PASSWORD_MESSAGES.tooLong;
  return "";
}

// "15 minutes" / "40 seconds" for the too-many-attempts message
export function waitText(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "a few minutes";
  if (seconds < 60) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
