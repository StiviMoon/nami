-- AlterTable
ALTER TABLE "menu_items" ADD COLUMN     "badge" VARCHAR(20);

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "bannerText" VARCHAR(200),
ADD COLUMN     "facebook" VARCHAR(100),
ADD COLUMN     "fontFamily" VARCHAR(50),
ADD COLUMN     "instagram" VARCHAR(100),
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "menuLayout" VARCHAR(10),
ADD COLUMN     "primaryColor" VARCHAR(7),
ADD COLUMN     "schedule" TEXT,
ADD COLUMN     "secondaryColor" VARCHAR(7),
ADD COLUMN     "tiktok" VARCHAR(100);
