/*
  Warnings:

  - You are about to drop the `pledges` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pledges" DROP CONSTRAINT "pledges_user_id_fkey";

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "totalDeposit" BIGINT NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "pledges";

-- CreateTable
CREATE TABLE "question_deposits" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "amount" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_deposits_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "question_deposits" ADD CONSTRAINT "question_deposits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_deposits" ADD CONSTRAINT "question_deposits_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
