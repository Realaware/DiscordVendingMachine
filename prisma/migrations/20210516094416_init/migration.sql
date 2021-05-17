-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "name" TEXT NOT NULL,
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Product" ("name", "id", "price") SELECT "name", "id", "price" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product.name_unique" ON "Product"("name");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
