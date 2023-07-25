/*
  Warnings:

  - You are about to drop the column `firstName` on the `HairSalon` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `HairSalon` table. All the data in the column will be lost.
  - The primary key for the `Location` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Queue` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customerId` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `Queue` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Queue` table. All the data in the column will be lost.
  - The primary key for the `Review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Stylist` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `ownerId` on table `HairSalon` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HairSalon" DROP CONSTRAINT "HairSalon_locationId_fkey";

-- DropForeignKey
ALTER TABLE "HairSalon" DROP CONSTRAINT "HairSalon_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_hairSalonId_fkey";

-- DropForeignKey
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_stylistId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_hairSalonId_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_hairSalonId_fkey";

-- DropForeignKey
ALTER TABLE "Stylist" DROP CONSTRAINT "Stylist_hairSalonId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "queueId" TEXT;

-- AlterTable
ALTER TABLE "HairSalon" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ALTER COLUMN "mainImage" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "openingTime" DROP NOT NULL,
ALTER COLUMN "closingTime" DROP NOT NULL,
ALTER COLUMN "priceRange" DROP NOT NULL,
ALTER COLUMN "locationId" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Location" DROP CONSTRAINT "Location_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Location_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Location_id_seq";

-- AlterTable
ALTER TABLE "Queue" DROP CONSTRAINT "Queue_pkey",
DROP COLUMN "customerId",
DROP COLUMN "position",
DROP COLUMN "status",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "stylistId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Queue_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Queue_id_seq";

-- AlterTable
ALTER TABLE "Review" DROP CONSTRAINT "Review_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Review_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Review_id_seq";

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Service_id_seq";

-- AlterTable
ALTER TABLE "Stylist" DROP CONSTRAINT "Stylist_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Stylist_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Stylist_id_seq";

-- AddForeignKey
ALTER TABLE "HairSalon" ADD CONSTRAINT "HairSalon_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HairSalon" ADD CONSTRAINT "HairSalon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stylist" ADD CONSTRAINT "Stylist_hairSalonId_fkey" FOREIGN KEY ("hairSalonId") REFERENCES "HairSalon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_queueId_fkey" FOREIGN KEY ("queueId") REFERENCES "Queue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_hairSalonId_fkey" FOREIGN KEY ("hairSalonId") REFERENCES "HairSalon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_hairSalonId_fkey" FOREIGN KEY ("hairSalonId") REFERENCES "HairSalon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_hairSalonId_fkey" FOREIGN KEY ("hairSalonId") REFERENCES "HairSalon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "Stylist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
