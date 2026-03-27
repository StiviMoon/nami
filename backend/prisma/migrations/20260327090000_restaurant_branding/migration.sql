-- CreateEnum
CREATE TYPE "ThemePreset" AS ENUM ('SUNSET', 'FOREST', 'OCEAN', 'BERRY', 'MONO');

-- CreateEnum
CREATE TYPE "MenuCardStyle" AS ENUM ('ROUNDED', 'SOFT', 'MINIMAL');

-- AlterTable
ALTER TABLE "restaurants"
ADD COLUMN "menuStyle" "MenuCardStyle" NOT NULL DEFAULT 'ROUNDED',
ADD COLUMN "themePreset" "ThemePreset" NOT NULL DEFAULT 'SUNSET';
