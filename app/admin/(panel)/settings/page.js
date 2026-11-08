import AdminHeader from "@/components/admin/AdminHeader";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";
import { panelClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth/session";

export const metadata = { title: "Settings" };

// Admin account settings. Inside the (panel) group, so proxy.js and the layout's
// requireAdmin() already keep signed-out visitors out; the password change itself is
// checked again by Better Auth (valid session + current password).
export default async function AdminSettingsPage() {
  const { user } = await requireAdmin();

  return (
    <>
      <AdminHeader eyebrow="Account" title="Settings" description="Manage the admin account you use to sign in to this panel." />

      <section aria-labelledby="change-password-heading" className={panelClass}>
        <div className="border-b border-[#2e2e2e] px-[20px] py-[14px] sm:px-[24px]">
          <h2 id="change-password-heading" className="font-oxanium text-[16px] font-bold leading-[24px] text-white">
            Change Password
          </h2>
          <p className="mt-[2px] text-[13px] leading-[20px] text-[#9d9d9d]">
            Enter your current password, then choose a new one. Other devices will be signed out.
          </p>
        </div>
        <div className="p-[20px] sm:p-[24px]">
          <ChangePasswordForm email={user.email} />
        </div>
      </section>
    </>
  );
}
