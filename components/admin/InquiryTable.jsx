import Link from "next/link";
import { ChevronRight } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";
import { focusRing } from "@/components/admin/ui";
import { formatDate } from "@/lib/admin/format";

const headCell = "px-[16px] py-[12px] text-left text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7a7a7a]";
const bodyCell = "px-[16px] py-[14px] align-middle";

// First letters of the first two words, for the avatar circle
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function Avatar({ name }) {
  return (
    <span
      aria-hidden
      className="flex size-[36px] shrink-0 items-center justify-center rounded-full border border-[#3a3a3a] bg-[#1b1b1b] font-oxanium text-[13px] font-bold text-[#e9e7e2]"
    >
      {initials(name)}
    </span>
  );
}

// Inquiries as a table from 768px, and as stacked cards below that so nothing has to
// scroll sideways on a phone. No hooks, so it works in server and client components.
export default function InquiryTable({ inquiries, showPhone = false, caption }) {
  return (
    <>
      {/* relative: keeps the sr-only link text inside this scroll box, so it can't widen the page */}
      <div className="relative hidden overflow-x-auto rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c] md:block">
        <table className="w-full min-w-[720px] border-collapse text-[14px] leading-[20px]">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="border-b border-[#2e2e2e] bg-[#101010]">
            <tr>
              <th scope="col" className={headCell}>Name</th>
              <th scope="col" className={headCell}>Company</th>
              <th scope="col" className={headCell}>Email</th>
              {showPhone && <th scope="col" className={headCell}>Phone</th>}
              <th scope="col" className={headCell}>Submitted</th>
              <th scope="col" className={headCell}>Status</th>
              <th scope="col" className={`${headCell} text-right`}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b1b1b]">
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} className="group transition-colors duration-200 hover:bg-[#121212]">
                {/* red rule on the hovered row, like the active item in the sidebar */}
                <td className={`${bodyCell} relative`}>
                  <span aria-hidden className="absolute inset-y-[10px] left-0 w-[2px] rounded-r bg-[#e00000] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                  <div className="flex items-center gap-[12px]">
                    <Avatar name={inquiry.fullName} />
                    <div className="min-w-0">
                      <p className="font-medium text-white">{inquiry.fullName}</p>
                      <p className="text-[12px] text-[#9d9d9d]">{inquiry.jobTitle}</p>
                    </div>
                  </div>
                </td>
                <td className={`${bodyCell} text-[#e9e7e2]`}>{inquiry.company}</td>
                <td className={`${bodyCell} max-w-[220px] truncate text-[#b2b2b2]`}>{inquiry.email}</td>
                {showPhone && <td className={`${bodyCell} whitespace-nowrap text-[#b2b2b2]`}>{inquiry.phone}</td>}
                <td className={`${bodyCell} whitespace-nowrap text-[#b2b2b2]`}>{formatDate(inquiry.createdAt)}</td>
                <td className={bodyCell}>
                  <StatusBadge status={inquiry.status} />
                </td>
                <td className={`${bodyCell} text-right`}>
                  <Link
                    href={`/admin/inquiries/${inquiry.id}`}
                    className={`inline-flex h-[32px] items-center gap-[4px] whitespace-nowrap rounded-[6px] px-[10px] text-[13px] font-medium text-[#e9e7e2] ring-1 ring-inset ring-[#2e2e2e] transition-colors duration-200 hover:bg-[#b80100] hover:text-white hover:ring-[#b80100] ${focusRing}`}
                  >
                    View
                    <span className="sr-only"> inquiry from {inquiry.fullName}</span>
                    <ChevronRight className="size-[14px]" aria-hidden />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-[12px] md:hidden">
        {inquiries.map((inquiry) => (
          <li key={inquiry.id}>
            <Link
              href={`/admin/inquiries/${inquiry.id}`}
              className={`block rounded-[12px] border border-[#2e2e2e] bg-[#0c0c0c] p-[16px] transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#121212] active:border-[#b80100] ${focusRing}`}
            >
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex min-w-0 items-center gap-[12px]">
                  <Avatar name={inquiry.fullName} />
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium leading-[22px] text-white">{inquiry.fullName}</p>
                    <p className="truncate text-[13px] leading-[20px] text-[#e9e7e2]">{inquiry.company}</p>
                  </div>
                </div>
                <StatusBadge status={inquiry.status} />
              </div>
              <dl className="mt-[12px] grid gap-[4px] border-t border-[#1b1b1b] pt-[12px] text-[13px] leading-[20px]">
                <div className="flex gap-[8px]">
                  <dt className="sr-only">Email</dt>
                  <dd className="truncate text-[#b2b2b2]">{inquiry.email}</dd>
                </div>
                {showPhone && (
                  <div className="flex gap-[8px]">
                    <dt className="sr-only">Phone</dt>
                    <dd className="text-[#b2b2b2]">{inquiry.phone}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-[8px]">
                  <dt className="sr-only">Submitted</dt>
                  <dd className="text-[#9d9d9d]">{formatDate(inquiry.createdAt)}</dd>
                  <span aria-hidden className="flex items-center gap-[2px] font-medium text-[#e00000]">
                    View <ChevronRight className="size-[14px]" />
                  </span>
                </div>
              </dl>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
