import Link from "next/link";
import { ArrowRight, CircleCheck, Clock, Inbox, Sparkles } from "lucide-react";
import AdminHeader, { SampleDataNotice } from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import StatusBreakdown from "@/components/admin/StatusBreakdown";
import InquiryTable from "@/components/admin/InquiryTable";
import EmptyState from "@/components/admin/EmptyState";
import { buttonSecondary } from "@/components/admin/ui";
import { getInquiryStats, getRecentInquiries } from "@/lib/admin/mockInquiries";

export const metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const [stats, recent] = await Promise.all([getInquiryStats(), getRecentInquiries(5)]);
  // Closed isn't returned by getInquiryStats; it is whatever the other statuses leave.
  const closed = Math.max(0, stats.total - stats.new - stats.inReview - stats.contacted);

  return (
    <>
      <AdminHeader
        eyebrow="Overview"
        title="Dashboard"
        description="An overview of partnership inquiries from the website."
      />
      <SampleDataNotice />

      <section aria-labelledby="overview-heading">
        <h2 id="overview-heading" className="sr-only">
          Overview
        </h2>
        <div className="grid grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Inquiries" value={stats.total} icon={Inbox} hint="All submissions" accent />
          <StatCard label="New Inquiries" value={stats.new} icon={Sparkles} hint="Not yet reviewed" />
          <StatCard label="In Review" value={stats.inReview} icon={Clock} hint="Being assessed" />
          <StatCard label="Contacted" value={stats.contacted} icon={CircleCheck} hint="Follow-up sent" />
        </div>
      </section>

      <StatusBreakdown
        total={stats.total}
        counts={{ NEW: stats.new, IN_REVIEW: stats.inReview, CONTACTED: stats.contacted, CLOSED: closed }}
      />

      <section aria-labelledby="recent-heading" className="flex flex-col gap-[16px]">
        <div className="flex flex-wrap items-end justify-between gap-[12px]">
          <div>
            <h2 id="recent-heading" className="font-oxanium text-[20px] font-bold leading-[28px] text-white">
              Recent Inquiries
            </h2>
            <p className="text-[14px] leading-[22px] text-[#9d9d9d]">The latest submissions, newest first.</p>
          </div>
          <Link href="/admin/inquiries" className={`group ${buttonSecondary}`}>
            View all inquiries
            <ArrowRight className="size-[16px] transition-transform duration-200 group-hover:translate-x-[2px]" aria-hidden />
          </Link>
        </div>

        {recent.length > 0 ? (
          <InquiryTable inquiries={recent} caption="Recent inquiries" />
        ) : (
          <EmptyState
            icon={Inbox}
            title="No inquiries yet"
            description="Submissions from the Partner With Us form will appear here."
          />
        )}
      </section>
    </>
  );
}
