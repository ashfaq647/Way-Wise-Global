import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

// Admin pages use px rather than rem throughout: from 1280px globals.css shrinks the root
// font size with the viewport for the public site, and the dashboard should stay a
// fixed, readable size.
export default function AdminPanelLayout({ children }) {
  return (
    <>
      <AdminSidebar />
      <div className="lg:pl-[260px]">
        <AdminTopbar />
        <main className="mx-auto flex w-full max-w-[1200px] flex-col gap-[24px] px-[16px] py-[24px] sm:px-[24px] sm:py-[32px] lg:px-[40px] lg:py-[36px]">
          {children}
        </main>
      </div>
    </>
  );
}
