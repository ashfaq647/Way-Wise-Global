import AuthPageShell from "@/components/admin/AuthPageShell";
import ResetPasswordForm from "@/components/admin/ResetPasswordForm";

// no-referrer: the address holds the reset token, so it must never be sent to another site
export const metadata = { title: "Reset password", referrer: "no-referrer" };

// Better Auth's tokens are 24 letters and digits; anything else can't be a valid link
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{16,128}$/;

// Public page (exempted in proxy.js), opened from the reset email:
// /admin/reset-password?token=…  The token is only checked when the form is sent (by
// Better Auth); a missing or malformed one shows the "invalid link" message straight away.
// It stays open when signed in: a successful reset signs out every session anyway.
export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;
  const validToken = typeof token === "string" && TOKEN_PATTERN.test(token) ? token : "";

  return (
    <AuthPageShell title="Choose a new password" description="Set a new password for the Way Wise Global admin account.">
      <ResetPasswordForm token={validToken} />
    </AuthPageShell>
  );
}
