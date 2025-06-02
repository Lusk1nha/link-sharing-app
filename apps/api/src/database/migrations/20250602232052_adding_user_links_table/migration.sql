/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `admins` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "link_types_enum" AS ENUM ('GITHUB', 'YOUTUBE', 'LINKEDIN', 'FACEBOOK', 'FRONTEND_MENTOR', 'HASHNODE', 'CUSTOM');

-- AlterTable
ALTER TABLE "admins" DROP CONSTRAINT "admins_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("user_id");

-- CreateTable
CREATE TABLE "UserLinks" (
    "id" SERIAL NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "link_type" "link_types_enum" NOT NULL,
    "link" VARCHAR(255) NOT NULL,
    "position" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLinks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_user_links_user_id" ON "UserLinks"("user_id");

-- AddForeignKey
ALTER TABLE "UserLinks" ADD CONSTRAINT "UserLinks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
