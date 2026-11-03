-- Human-readable inquiry references (WWG-<year>-0001). Written by hand so it is safe on a
-- database that already has inquiries: nothing is dropped, every existing value is kept.
-- Runs in one transaction: either all of it applies or none of it does.
BEGIN;

-- 1. Keep the old integer "reference" (SERIAL) values: rename the column to "sequence".
--    Renaming keeps the data, the unique index and the sequence; their names are updated
--    to what Prisma expects for the new field name.
ALTER TABLE "Inquiry" RENAME COLUMN "reference" TO "sequence";
ALTER INDEX "Inquiry_reference_key" RENAME TO "Inquiry_sequence_key";
ALTER SEQUENCE "Inquiry_reference_seq" RENAME TO "Inquiry_sequence_seq";

-- 2. Add the new text reference, empty for now.
ALTER TABLE "Inquiry" ADD COLUMN "reference" VARCHAR(20);

-- 3. Give every existing inquiry a reference: numbered per year (createdAt is stored in UTC),
--    oldest first, ties broken by the old sequence number. LPAD to 4 digits, never truncating.
WITH numbered AS (
  SELECT
    "id",
    EXTRACT(YEAR FROM "createdAt")::int AS year,
    ROW_NUMBER() OVER (
      PARTITION BY EXTRACT(YEAR FROM "createdAt")
      ORDER BY "createdAt", "sequence"
    ) AS n
  FROM "Inquiry"
)
UPDATE "Inquiry" AS i
SET "reference" = 'WWG-' || numbered.year || '-' || LPAD(numbered.n::text, GREATEST(4, LENGTH(numbered.n::text)), '0')
FROM numbered
WHERE i."id" = numbered."id";

-- 4. Now required and unique.
ALTER TABLE "Inquiry" ALTER COLUMN "reference" SET NOT NULL;
CREATE UNIQUE INDEX "Inquiry_reference_key" ON "Inquiry"("reference");

-- 5. Per-year counter used for new inquiries (lib/inquiry-reference.js).
CREATE TABLE "InquiryReferenceCounter" (
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL,

    CONSTRAINT "InquiryReferenceCounter_pkey" PRIMARY KEY ("year")
);

-- Start each year's counter at the highest number given out in step 3, so the next new
-- inquiry continues from there.
INSERT INTO "InquiryReferenceCounter" ("year", "lastNumber")
SELECT
  CAST(SPLIT_PART("reference", '-', 2) AS INTEGER),
  MAX(CAST(SPLIT_PART("reference", '-', 3) AS INTEGER))
FROM "Inquiry"
GROUP BY 1;

COMMIT;
