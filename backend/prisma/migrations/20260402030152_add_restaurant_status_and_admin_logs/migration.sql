-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('PENDING', 'ACTIVE', 'REJECTED', 'SUSPENDED');

-- AlterTable
ALTER TABLE "restaurants" ADD COLUMN     "pageViews" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "rejectionNote" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" TEXT,
ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "whatsappClicks" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "admin_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetType" VARCHAR(30) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "admin_logs_targetId_idx" ON "admin_logs"("targetId");

-- CreateIndex
CREATE INDEX "admin_logs_adminId_idx" ON "admin_logs"("adminId");

-- CreateIndex
CREATE INDEX "restaurants_status_idx" ON "restaurants"("status");
