/*
  Warnings:

  - The primary key for the `answers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `holders` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pledges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `questions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `trade_logs` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_question_id_fkey";

-- AlterTable
ALTER TABLE "answers" DROP CONSTRAINT "answers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "question_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "answers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "answers_id_seq";

-- AlterTable
ALTER TABLE "holders" DROP CONSTRAINT "holders_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "holders_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "holders_id_seq";

-- AlterTable
ALTER TABLE "pledges" DROP CONSTRAINT "pledges_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "pledges_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "pledges_id_seq";

-- AlterTable
ALTER TABLE "questions" DROP CONSTRAINT "questions_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "questions_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "questions_id_seq";

-- AlterTable
ALTER TABLE "trade_logs" DROP CONSTRAINT "trade_logs_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "trade_logs_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "trade_logs_id_seq";

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
