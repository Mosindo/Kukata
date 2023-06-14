/*
  Warnings:

  - You are about to drop the column `PhoneNumber` on the `Owner` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "PhoneNumber",
ADD COLUMN     "phoneNumber" TEXT;
