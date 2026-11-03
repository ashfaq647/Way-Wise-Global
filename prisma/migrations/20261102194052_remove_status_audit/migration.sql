/*
  Warnings:

  - You are about to drop the `InquiryStatusChange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InquiryStatusChange" DROP CONSTRAINT "InquiryStatusChange_changedById_fkey";

-- DropForeignKey
ALTER TABLE "InquiryStatusChange" DROP CONSTRAINT "InquiryStatusChange_inquiryId_fkey";

-- DropTable
DROP TABLE "InquiryStatusChange";
