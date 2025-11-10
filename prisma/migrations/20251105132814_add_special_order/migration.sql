-- CreateTable
CREATE TABLE "SpecialOrder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
