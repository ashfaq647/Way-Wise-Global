import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Building2,
  CalendarClock,
  FileSearch,
  Globe,
  Handshake,
  Hash,
  Mail,
  MessageSquareText,
  Phone,
  User,
} from "lucide-react";
import AdminHeader, { SampleDataNotice } from "@/components/admin/AdminHeader";
import EmptyState from "@/components/admin/EmptyState";
import InquiryStatusSelect from "@/components/admin/InquiryStatusSelect";
import StatusBadge from "@/components/admin/StatusBadge";
import { buttonPrimary, buttonSecondary, focusRing, panelClass } from "@/components/admin/ui";
import { getInquiryById } from "@/lib/admin/mockInquiries";
import { formatDateTime } from "@/lib/admin/format";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);
  return { title: inquiry ? `Inquiry from ${inquiry.fullName}` : "Inquiry not found" };
}

function BackLink() {
  return (
    <Link
      href="/admin/inquiries"
      className={`inline-flex w-fit items-center gap-[6px] rounded-[6px] text-[14px] text-[#b2b2b2] transition-colors duration-200 hover:text-white ${focusRing}`}
    >
      <ArrowLeft className="size-[16px]" aria-hidden />
      Back to inquiries
    </Link>
  );
}

function Field({ label, icon: Icon, children, wide = false }) {
  return (
    <div className={`flex min-w-0 gap-[12px] ${wide ? "sm:col-span-2" : ""}`}>
      {Icon && (
        <span aria-hidden className="mt-[2px] flex size-[32px] shrink-0 items-center justify-center rounded-[8px] border border-[#2e2e2e] bg-[#121212] text-[#9d9d9d]">
          <Icon className="size-[15px]" />
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-[4px]">
        <dt className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a7a]">{label}</dt>
        <dd className="break-words text-[15px] leading-[22px] text-white">{children}</dd>
      </div>
    </div>
  );
}

// Panel with a title bar, used for each block of details
function Panel({ id, title, children, className = "" }) {
  return (
    <section aria-labelledby={id} className={`${panelClass} ${className}`}>
      <h2 id={id} className="border-b border-[#2e2e2e] px-[20px] py-[14px] font-oxanium text-[16px] font-bold leading-[24px] text-white sm:px-[24px]">
        {title}
      </h2>
      <div className="p-[20px] sm:p-[24px]">{children}</div>
    </section>
  );
}

const linkClass = `rounded-[4px] text-white underline decoration-[#3a3a3a] underline-offset-[4px] transition-colors duration-200 hover:decoration-[#e00000] ${focusRing}`;

export default async function AdminInquiryDetailPage({ params }) {
  const { id } = await params;
  const inquiry = await getInquiryById(id);

  if (!inquiry) {
    return (
      <>
        <BackLink />
        <EmptyState
          icon={FileSearch}
          title="Inquiry not found"
          description="There is no inquiry with this ID. It may have been removed, or the link may be incorrect."
        >
          <Link href="/admin/inquiries" className={buttonPrimary}>
            View all inquiries
          </Link>
        </EmptyState>
      </>
    );
  }

  const phoneHref = `tel:${inquiry.phone.replace(/[^\d+]/g, "")}`;

  return (
    <>
      <BackLink />
      <AdminHeader
        eyebrow="Inquiry"
        title={inquiry.fullName}
        description={`${inquiry.jobTitle} at ${inquiry.company} · Submitted ${formatDateTime(inquiry.createdAt)}`}
        actions={<StatusBadge status={inquiry.status} />}
      />
      <SampleDataNotice />

      <div className="grid grid-cols-1 gap-[20px] lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex flex-col gap-[20px]">
          <Panel id="contact-heading" title="Contact Details">
            <dl className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
              <Field label="Full name" icon={User}>{inquiry.fullName}</Field>
              <Field label="Job title / role" icon={Briefcase}>{inquiry.jobTitle}</Field>
              <Field label="Company / organization" icon={Building2}>{inquiry.company}</Field>
              <Field label="Business email" icon={Mail}>
                <a href={`mailto:${inquiry.email}`} className={linkClass}>
                  {inquiry.email}
                </a>
              </Field>
              <Field label="Phone number" icon={Phone}>
                <a href={phoneHref} className={linkClass}>
                  {inquiry.phone}
                </a>
              </Field>
              <Field label="Company website" icon={Globe}>
                {inquiry.website ? (
                  <a href={inquiry.website} target="_blank" rel="noopener noreferrer nofollow" className={linkClass}>
                    {inquiry.website}
                  </a>
                ) : (
                  <span className="text-[#6b6b6b]">Not provided</span>
                )}
              </Field>
            </dl>
          </Panel>

          <Panel id="opportunity-heading" title="Opportunity">
            <dl className="grid grid-cols-1 gap-[20px] sm:grid-cols-2">
              <Field label="How can we work together?" icon={Handshake}>{inquiry.opportunity}</Field>
              <Field label="Business of interest" icon={Building2}>{inquiry.business}</Field>
              <Field label="Message" icon={MessageSquareText} wide>
                {inquiry.message ? (
                  <span className="block whitespace-pre-line rounded-[8px] border-l-[3px] border-[#b80100] bg-[#101010] px-[16px] py-[12px] text-[#e9e7e2]">
                    {inquiry.message}
                  </span>
                ) : (
                  <span className="text-[#6b6b6b]">No message provided</span>
                )}
              </Field>
            </dl>
          </Panel>
        </div>

        <div className="flex h-fit flex-col gap-[20px] lg:sticky lg:top-[88px]">
          <Panel id="status-heading" title="Status">
            <InquiryStatusSelect initialStatus={inquiry.status} />
            <dl className="mt-[20px] flex flex-col gap-[12px] border-t border-[#2e2e2e] pt-[16px] text-[13px]">
              <div className="flex items-center justify-between gap-[12px]">
                <dt className="flex items-center gap-[6px] text-[#9d9d9d]">
                  <CalendarClock className="size-[14px]" aria-hidden />
                  Submitted
                </dt>
                <dd className="text-right text-[#e9e7e2]">{formatDateTime(inquiry.createdAt)}</dd>
              </div>
              <div className="flex items-center justify-between gap-[12px]">
                <dt className="flex items-center gap-[6px] text-[#9d9d9d]">
                  <Hash className="size-[14px]" aria-hidden />
                  Reference
                </dt>
                <dd className="font-mono text-[#e9e7e2]">{inquiry.id}</dd>
              </div>
            </dl>
          </Panel>

          {/* Shortcuts to the same mailto: and tel: links as in Contact Details */}
          <Panel id="reply-heading" title="Get in Touch">
            <div className="flex flex-col gap-[10px]">
              <a href={`mailto:${inquiry.email}`} className={`${buttonPrimary} w-full`}>
                <Mail className="size-[16px]" aria-hidden />
                Send email
              </a>
              <a href={phoneHref} className={`${buttonSecondary} w-full`}>
                <Phone className="size-[16px]" aria-hidden />
                Call
              </a>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}
