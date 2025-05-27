/*
  Warnings:

  - You are about to drop the column `weightUnit` on the `Set` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Set" DROP COLUMN "weightUnit";

-- DropEnum
DROP TYPE "WeightUnit";
