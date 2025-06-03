/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credentials" ADD COLUMN     "email" VARCHAR(255) NOT NULL,
ADD COLUMN     "password_hash" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "credentials_email_key" ON "credentials"("email");
