/*
  Warnings:

  - Added the required column `block_hash` to the `trade_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `trade_logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeType" AS ENUM ('CREATED', 'BOUGHT', 'SOLD');

-- AlterTable
ALTER TABLE "trade_logs" ADD COLUMN     "block_hash" TEXT NOT NULL,
ADD COLUMN     "type" "TradeType" NOT NULL;
