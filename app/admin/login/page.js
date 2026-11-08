import { redirect } from "next/navigation";
import AuthPageShell from "@/components/admin/AuthPageShell";
import LoginForm from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth/session";

export const metadata = { title: "Log in" };

// Layout (background artwork, brand panel, card) is shared with the forgot and reset
// password pages: components/admin/AuthPageShell.jsx
export default async function AdminLoginPage() {
  // Already signed in (checked against the database): go straight to the panel
  if (await getAdminSession()) redirect("/admin");

  return (
    <AuthPageShell title="Sign in" description="Access the Way Wise Global admin panel.">
      <LoginForm />
    </AuthPageShell>
  );
}
