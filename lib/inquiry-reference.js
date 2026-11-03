// Human-readable inquiry references: WWG-<UTC year>-<number>, e.g. "WWG-2026-0001".
// The CUID `id` stays the primary key; this is only for people to read and quote.
//
// A plain module (no "server-only", no "@/" imports) so prisma/seed.mjs can use it under
// Node as well as the app (lib/inquiries.js).
//
// How uniqueness is guaranteed: the next number comes from one row per year in
// "InquiryReferenceCounter", incremented with a single INSERT … ON CONFLICT DO UPDATE inside
// the same transaction that creates the inquiry. PostgreSQL locks that row until the
// transaction ends, so simultaneous submissions take turns and each gets its own number.
// If creating the inquiry fails, the transaction rolls back and the number is not used up.
// Numbers never depend on how many inquiries exist, and are never reused.

export const REFERENCE_PREFIX = "WWG";

// References written by hand (e.g. in Prisma Studio) ahead of the counter are skipped in
// nextInquiryReference. A unique-constraint conflict is then only possible if such a row is
// written in the instant between that check and the insert; the retry sees it and skips it.
const MAX_ATTEMPTS = 5;

export function formatInquiryReference(year, number) {
  return `${REFERENCE_PREFIX}-${year}-${String(number).padStart(4, "0")}`;
}

// Takes the next reference for the UTC year of `createdAt`. Must be called inside a
// transaction (tx), which holds the counter row's lock until it commits or rolls back.
export async function nextInquiryReference(tx, createdAt) {
  const year = createdAt.getUTCFullYear();
  for (;;) {
    const [{ lastNumber }] = await tx.$queryRaw`
      INSERT INTO "InquiryReferenceCounter" ("year", "lastNumber")
      VALUES (${year}, 1)
      ON CONFLICT ("year")
      DO UPDATE SET "lastNumber" = "InquiryReferenceCounter"."lastNumber" + 1
      RETURNING "lastNumber"`;
    const reference = formatInquiryReference(year, lastNumber);
    // Normally free. If a reference was written by hand ahead of the counter, skip that
    // number (still holding the lock) instead of failing: a failed insert would roll the
    // counter back and every retry would hit the same number again.
    const taken = await tx.inquiry.findUnique({ where: { reference }, select: { id: true } });
    if (!taken) return reference;
  }
}

// P2002 = unique constraint failed. With the PostgreSQL driver adapter the index name is in
// meta.driverAdapterError.cause.constraint (an Error object, so it has to be read field by
// field); other setups report meta.target. Only a conflict on "reference" is retried.
function isReferenceConflict(error) {
  if (error?.code !== "P2002") return false;
  const meta = error.meta ?? {};
  const constraint = meta.driverAdapterError?.cause?.constraint ?? {};
  const names = [meta.target, constraint.index, constraint.fields].flat().filter(Boolean).map(String);
  return names.some((name) => name.includes("reference"));
}

// Creates one inquiry with a newly assigned reference. `data` is the validated inquiry
// (without id/reference). Returns the created row's `select`ed fields.
export async function createInquiryWithReference(prisma, data, { select = { id: true } } = {}) {
  // the same instant decides both the stored date and the reference year
  const createdAt = data.createdAt ?? new Date();

  for (let attempt = 1; ; attempt++) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const reference = await nextInquiryReference(tx, createdAt);
          return tx.inquiry.create({ data: { ...data, createdAt, reference }, select });
        },
        // waiting for a pooled connection / the counter lock under load
        { maxWait: 10_000, timeout: 15_000 },
      );
    } catch (error) {
      if (attempt >= MAX_ATTEMPTS || !isReferenceConflict(error)) throw error;
    }
  }
}
