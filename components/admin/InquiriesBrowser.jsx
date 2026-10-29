"use client";

import { useDeferredValue, useState } from "react";
import { Inbox, SearchX } from "lucide-react";
import AdminSearch from "@/components/admin/AdminSearch";
import InquiryTable from "@/components/admin/InquiryTable";
import EmptyState from "@/components/admin/EmptyState";
import { buttonSecondary, focusRing, panelClass } from "@/components/admin/ui";

const searchable = ["fullName", "company", "email", "phone", "jobTitle", "business"];

// Filters the list it is given in the browser. Fine for the sample data; with a real
// database the search and filter can move to the query instead.
export default function InquiriesBrowser({ inquiries }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("ALL");
  const deferredQuery = useDeferredValue(query);

  const needle = deferredQuery.trim().toLowerCase();
  const filtered = inquiries.filter(
    (inquiry) =>
      (status === "ALL" || inquiry.status === status) &&
      (!needle || searchable.some((key) => inquiry[key]?.toLowerCase().includes(needle))),
  );
  const isFiltering = needle !== "" || status !== "ALL";

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
  }

  if (inquiries.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title="No inquiries yet"
        description="Submissions from the Partner With Us form will be listed here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <div className={`${panelClass} flex flex-col gap-[12px] p-[12px] sm:p-[16px]`}>
        <AdminSearch query={query} onQueryChange={setQuery} status={status} onStatusChange={setStatus} />

        <div className="flex min-h-[24px] flex-wrap items-center justify-between gap-[8px] px-[2px]">
          <p className="text-[13px] leading-[20px] text-[#9d9d9d]" aria-live="polite">
            Showing <span className="font-medium text-white">{filtered.length}</span> of {inquiries.length}{" "}
            {inquiries.length === 1 ? "inquiry" : "inquiries"}
          </p>
          {isFiltering && filtered.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className={`cursor-pointer rounded-[4px] text-[13px] font-medium text-[#e00000] transition-colors duration-200 hover:text-[#ff4d4d] ${focusRing}`}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <InquiryTable inquiries={filtered} showPhone caption="Partnership inquiries" />
      ) : (
        <EmptyState
          icon={SearchX}
          title="No matching inquiries"
          description="Try a different search term or status."
        >
          {isFiltering && (
            <button
              type="button"
              onClick={clearFilters}
              className={buttonSecondary}
            >
              Clear filters
            </button>
          )}
        </EmptyState>
      )}
    </div>
  );
}
