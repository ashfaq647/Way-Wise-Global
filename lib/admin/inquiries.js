import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { inquiryIdSchema, updateInquiryStatusSchema } from "@/lib/validations/inquiry";

// Data access for the admin panel: every read and write of inquiries goes through here.
// Server-only: database access never reaches the browser.
//
// Every function starts with requireAdmin(): no valid admin session, no data. This is the
// security boundary; proxy.js and the page layout are only conveniences in front of it.
// (requireAdmin also makes each page render per request; connection() states that intent
// explicitly for reads.)

// Field selections: each query returns only what its screen shows, so nothing extra is
// serialised into the page (the list is rendered by a Client Component).
// Dashboard "Recent Inquiries" table (InquiryTable without the phone column)
const recentSelect = {
  id: true,
  reference: true,
  fullName: true,
  jobTitle: true,
  company: true,
  email: true,
  status: true,
  createdAt: true,
};
// Inquiries list: the table columns plus the fields the search box looks in
const listSelect = { ...recentSelect, phone: true, business: true };
// Detail page: everything the admin needs to see
const detailSelect = { ...listSelect, website: true, opportunity: true, message: true };

const newestFirst = [{ createdAt: "desc" }, { sequence: "desc" }];

export async function getInquiries() {
  await requireAdmin();
  await connection();
  return prisma.inquiry.findMany({ select: listSelect, orderBy: newestFirst });
}

export async function getRecentInquiries(limit = 5) {
  await requireAdmin();
  await connection();
  const take = Math.min(Math.max(Math.trunc(Number(limit)) || 5, 1), 50);
  return prisma.inquiry.findMany({ select: recentSelect, orderBy: newestFirst, take });
}

// cache(): generateMetadata and the page both ask for the same inquiry in one request; this
// runs the query once. Returns null for a malformed ID or a missing record.
export const getInquiryById = cache(async (id) => {
  await requireAdmin();
  await connection();
  const parsed = inquiryIdSchema.safeParse(id);
  if (!parsed.success) return null;
  return prisma.inquiry.findUnique({ where: { id: parsed.data }, select: detailSelect });
});

// Who an admin email goes to: always the inquiry's own address from the database, never an
// address sent by the browser. Returns null for a malformed ID or a missing record.
export async function getInquiryEmailRecipient(id) {
  await requireAdmin();
  const parsed = inquiryIdSchema.safeParse(id);
  if (!parsed.success) return null;
  return prisma.inquiry.findUnique({ where: { id: parsed.data }, select: { email: true } });
}

export async function getInquiryStats() {
  await requireAdmin();
  await connection();
  const groups = await prisma.inquiry.groupBy({ by: ["status"], _count: { _all: true } });
  const count = (status) => groups.find((g) => g.status === status)?._count._all ?? 0;
  return {
    total: groups.reduce((sum, g) => sum + g._count._all, 0),
    new: count("NEW"),
    inReview: count("IN_REVIEW"),
    contacted: count("CONTACTED"),
  };
}

// Changes one inquiry's status. Validates its own input (it must never trust its caller).
// Returns { ok: true, status } | { ok: false, reason: "invalid" | "not_found", error? }.
export async function setInquiryStatus(input) {
  await requireAdmin();

  const parsed = updateInquiryStatusSchema.safeParse(input);
  if (!parsed.success) return { ok: false, reason: "invalid", error: parsed.error };
  const { id, status } = parsed.data;

  // updateMany with a where clause returns a count instead of throwing when the row is gone
  const { count } = await prisma.inquiry.updateMany({ where: { id }, data: { status } });
  if (count === 0) return { ok: false, reason: "not_found" };
  return { ok: true, status };
}
