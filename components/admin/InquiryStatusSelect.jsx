"use client";

import { useId, useState, useTransition } from "react";
import Image from "next/image";
import StatusBadge from "@/components/admin/StatusBadge";
import Notice from "@/components/admin/Notice";
import { fieldClass } from "@/components/admin/ui";
import { INQUIRY_STATUSES } from "@/lib/admin/statuses";
import { updateInquiryStatus } from "@/lib/admin/actions";

// Saves as soon as a new status is picked. The server validates the ID and status again
// (lib/validations/inquiry.js); if saving fails, the select goes back to the saved value.
export default function InquiryStatusSelect({ inquiryId, initialStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [savedStatus, setSavedStatus] = useState(initialStatus);
  const [result, setResult] = useState(null); // { ok, error? } from the last save
  const [isPending, startTransition] = useTransition();
  const id = useId();

  function handleChange(e) {
    const next = e.target.value;
    setStatus(next);
    setResult(null);
    startTransition(async () => {
      let res;
      try {
        res = await updateInquiryStatus({ id: inquiryId, status: next });
      } catch {
        res = { ok: false, error: "The status could not be saved. Check your connection and try again." };
      }
      // No result: the session had ended and the server redirected to the login page
      if (!res) return;
      if (res.ok) {
        setSavedStatus(res.status);
        setStatus(res.status);
      } else {
        setStatus(savedStatus);
      }
      setResult(res);
    });
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <div className="flex items-center justify-between gap-[12px] rounded-[8px] border border-[#2e2e2e] bg-[#101010] px-[12px] py-[10px]">
        <span className="text-[13px] text-[#9d9d9d]">Current status</span>
        <StatusBadge status={savedStatus} />
      </div>

      <label htmlFor={id} className="mt-[4px] text-[13px] font-medium text-white">
        Change status
      </label>
      <div className="relative">
        <select
          id={id}
          value={status}
          onChange={handleChange}
          disabled={isPending}
          aria-invalid={result && !result.ok ? "true" : undefined}
          className={`${fieldClass} cursor-pointer appearance-none pl-[14px] pr-[40px] disabled:cursor-wait disabled:opacity-60`}
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
        {isPending ? (
          <p className="text-[12px] leading-[18px] text-[#9d9d9d]">Saving…</p>
        ) : result && !result.ok ? (
          <Notice variant="error">{result.error}</Notice>
        ) : result?.ok ? (
          <p className="text-[12px] leading-[18px] text-[#9d9d9d]">Status saved.</p>
        ) : (
          <p className="text-[12px] leading-[18px] text-[#9d9d9d]">Changes are saved as soon as you pick a status.</p>
        )}
      </div>
    </div>
  );
}
