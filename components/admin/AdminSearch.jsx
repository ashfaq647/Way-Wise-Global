"use client";

import { useId } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { fieldClass } from "@/components/admin/ui";
import { INQUIRY_STATUSES } from "@/lib/admin/statuses";

// Kept as an export from here too, for anything still importing it from this file.
export { fieldClass };

// Controlled search box + status filter. The parent owns the values.
export default function AdminSearch({ query, onQueryChange, status, onStatusChange }) {
  const searchId = useId();
  const statusId = useId();

  return (
    <div role="search" className="flex flex-col gap-[12px] sm:flex-row">
      <div className="relative min-w-0 flex-1">
        <label htmlFor={searchId} className="sr-only">
          Search inquiries
        </label>
        <Search
          aria-hidden
          className="pointer-events-none absolute left-[14px] top-1/2 size-[18px] -translate-y-1/2 text-[#7a7a7a]"
        />
        <input
          id={searchId}
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search name, company, email or phone"
          autoComplete="off"
          className={`${fieldClass} pl-[42px] pr-[14px]`}
        />
      </div>

      <div className="relative sm:w-[200px]">
        <label htmlFor={statusId} className="sr-only">
          Filter by status
        </label>
        <select
          id={statusId}
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className={`${fieldClass} cursor-pointer appearance-none pl-[14px] pr-[40px]`}
        >
          <option value="ALL" className="bg-[#0a0a0a]">All statuses</option>
          {INQUIRY_STATUSES.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#0a0a0a]">
              {s.label}
            </option>
          ))}
        </select>
        <Image
          src="/images/icons/chevron-down.svg"
          alt=""
          width={16}
          height={16}
          className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
}
