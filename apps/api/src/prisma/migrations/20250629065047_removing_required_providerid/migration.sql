-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_auth_providers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "provider_type" TEXT NOT NULL,
    "provider_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "auth_providers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
INSERT INTO "new_auth_providers" ("created_at", "id", "provider_id", "provider_type", "updated_at", "user_id") SELECT "created_at", "id", "provider_id", "provider_type", "updated_at", "user_id" FROM "auth_providers";
DROP TABLE "auth_providers";
ALTER TABLE "new_auth_providers" RENAME TO "auth_providers";
CREATE UNIQUE INDEX "auth_providers_user_id_provider_type_key" ON "auth_providers"("user_id", "provider_type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
