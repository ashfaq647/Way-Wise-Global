"use client";

import { useId, useState } from "react";
import Image from "next/image";
import StatusBadge from "@/components/admin/StatusBadge";
import Notice from "@/components/admin/Notice";
import { fieldClass } from "@/components/admin/ui";
import { INQUIRY_STATUSES } from "@/lib/admin/statuses";

// Local state only for now: the change is visible on this page but is not saved and is
// lost on reload. Saving is wired up once the database exists.
export default function InquiryStatusSelect({ initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const id = useId();
  const changed = status !== initialStatus;

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center justify-between gap-[12px] rounded-[8px] border border-[#2e2e2e] bg-[#101010] px-[12px] py-[10px]">
        <span className="text-[13px] text-[#9d9d9d]">Current status</span>
        <StatusBadge status={status} />
      </div>

      <label htmlFor={id} className="mt-[4px] text-[13px] font-medium text-white">
        Change status
      </label>
      <div className="relative">
        <select
          id={id}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={`${fieldClass} cursor-pointer appearance-none pl-[14px] pr-[40px]`}
        >
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

      <div aria-live="polite">
        {changed ? (
          <Notice variant="warning">Preview only: this change is not saved and will reset when the page reloads.</Notice>
        ) : (
          <p className="text-[12px] leading-[18px] text-[#9d9d9d]">Status changes are not saved yet in this preview.</p>
        )}
      </div>
    </div>
  );
}
