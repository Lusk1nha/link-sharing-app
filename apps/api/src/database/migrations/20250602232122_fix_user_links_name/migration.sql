/*
  Warnings:

  - You are about to drop the `UserLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserLinks" DROP CONSTRAINT "UserLinks_user_id_fkey";

-- DropTable
DROP TABLE "UserLinks";

-- CreateTable
CREATE TABLE "user_links" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "link_type" "link_types_enum" NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "position" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_links_user_id" ON "user_links"("user_id");

-- AddForeignKey
ALTER TABLE "user_links" ADD CONSTRAINT "user_links_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
