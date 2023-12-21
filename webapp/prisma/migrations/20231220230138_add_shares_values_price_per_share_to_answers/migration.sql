-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "price_per_share" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "shares" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "values" BIGINT NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "holders" ADD CONSTRAINT "holders_token_id_fkey" FOREIGN KEY ("token_id") REFERENCES "answers"("token_id") ON DELETE RESTRICT ON UPDATE CASCADE;
