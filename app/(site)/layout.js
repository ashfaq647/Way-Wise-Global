import Navbar from "@/components/Navbar";
import { PartnerWithUsProvider } from "@/components/PartnerWithUs";

// Public website shell. Kept out of the root layout so /admin doesn't get the site
// navbar or the Partner With Us modal.
export default function SiteLayout({ children }) {
  return (
    <PartnerWithUsProvider>
      <Navbar />
      {children}
    </PartnerWithUsProvider>
  );
}
