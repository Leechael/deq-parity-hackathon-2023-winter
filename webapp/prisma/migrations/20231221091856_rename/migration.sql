/*
  Warnings:

  - You are about to drop the column `totalDeposit` on the `questions` table. All the data in the column will be lost.

*/
-- AlterTable
alter table "questions" RENAME COLUMN "totalDeposit" to "total_deposit";
