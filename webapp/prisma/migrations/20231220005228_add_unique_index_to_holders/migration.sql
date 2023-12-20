/*
  Warnings:

  - A unique constraint covering the columns `[user_id,token_id]` on the table `holders` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "holders_user_id_token_id_key" ON "holders"("user_id", "token_id");
