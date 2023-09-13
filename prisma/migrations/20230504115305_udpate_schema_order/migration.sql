-- CreateEnum
CREATE TYPE "USERCATEGORY" AS ENUM ('CUSTOMER', 'OWNER', 'STYLIST');

-- DropForeignKey
ALTER TABLE "HairSalon" DROP CONSTRAINT "HairSalon_locationId_fkey";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "role" "USERCATEGORY" NOT NULL DEFAULT 'CUSTOMER';

-- AlterTable
ALTER TABLE "HairSalon" ALTER COLUMN "locationId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "role" "USERCATEGORY" NOT NULL DEFAULT 'OWNER';

-- AlterTable
ALTER TABLE "Stylist" ADD COLUMN     "role" "USERCATEGORY" NOT NULL DEFAULT 'STYLIST',
ALTER COLUMN "mainImage" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HairSalon" ADD CONSTRAINT "HairSalon_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;