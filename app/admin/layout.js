// Shared by every /admin route, including /admin/login. The sidebar shell is in
// app/admin/(panel)/layout.js so the login page doesn't get it.
export const metadata = {
  title: {
    default: "Admin | Way Wise Global",
    template: "%s | Way Wise Global Admin",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-dvh bg-black text-white">{children}</div>;
}
