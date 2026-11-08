import { redirect } from "next/navigation";
import AuthPageShell from "@/components/admin/AuthPageShell";
import ForgotPasswordForm from "@/components/admin/ForgotPasswordForm";
import { getAdminSession } from "@/lib/auth/session";

export const metadata = { title: "Forgot password" };

// Public page (exempted in proxy.js): asks for the admin email and sends a reset link.
export default async function ForgotPasswordPage() {
  // Already signed in (checked against the database): go straight to the panel
  if (await getAdminSession()) redirect("/admin");

  return (
    <AuthPageShell
      title="Forgot password"
      description="Enter the admin email address and we'll send you a link to choose a new password."
    >
      <ForgotPasswordForm />
    </AuthPageShell>
  );
}
