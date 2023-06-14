/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `HairSalon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[locationId]` on the table `HairSalon` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `HairSalon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `HairSalon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `HairSalon` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QUEUESTATUS" AS ENUM ('WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "updatedAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HairSalon" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Review" ALTER COLUMN "rating" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "Stylist" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "Queue" (
    "id" SERIAL NOT NULL,
    "hairSalonId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "stylistId" INTEGER NOT NULL,
    "position" SERIAL NOT NULL,
    "status" "QUEUESTATUS" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HairSalon_email_key" ON "HairSalon"("email");

-- CreateIndex
CREATE UNIQUE INDEX "HairSalon_locationId_key" ON "HairSalon"("locationId");

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_hairSalonId_fkey" FOREIGN KEY ("hairSalonId") REFERENCES "HairSalon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Queue" ADD CONSTRAINT "Queue_stylistId_fkey" FOREIGN KEY ("stylistId") REFERENCES "Stylist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
