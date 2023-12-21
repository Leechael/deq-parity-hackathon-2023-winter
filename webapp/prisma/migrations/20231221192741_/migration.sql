/*
  Warnings:

  - Made the column `picked` on table `answers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "answers" ALTER COLUMN "picked" SET NOT NULL;
