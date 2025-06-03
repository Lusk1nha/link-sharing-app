-- CreateEnum
CREATE TYPE "AuthSignInType" AS ENUM ('CREDENTIALS', 'GOOGLE', 'GITHUB');

-- CreateTable
CREATE TABLE "auth_providers" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" VARCHAR(255) NOT NULL,
    "auth_sign_in_type" "AuthSignInType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_providers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_auth_provider_user_id" ON "auth_providers"("user_id");

-- AddForeignKey
ALTER TABLE "auth_providers" ADD CONSTRAINT "auth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
