import AdminHeader from "@/components/admin/AdminHeader";
import InquiriesBrowser from "@/components/admin/InquiriesBrowser";
import { getInquiries } from "@/lib/admin/inquiries";

export const metadata = { title: "Inquiries" };

export default async function AdminInquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <>
      <AdminHeader
        eyebrow="Partnerships"
        title="Inquiries"
        description="Partnership inquiries submitted through the Partner With Us form. Search, filter by status and open an inquiry to see its details."
      />
      <InquiriesBrowser inquiries={inquiries} />
    </>
  );
}
