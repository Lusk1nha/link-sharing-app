/*
  Warnings:

  - A unique constraint covering the columns `[user_id,provider_type]` on the table `auth_providers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "auth_providers_user_id_provider_type_key" ON "auth_providers"("user_id", "provider_type");
