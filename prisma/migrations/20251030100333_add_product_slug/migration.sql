/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Producto` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Producto_slug_key" ON "Producto"("slug");
