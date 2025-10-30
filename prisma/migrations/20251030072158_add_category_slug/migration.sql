/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Categoria` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageUrl` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Categoria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Categoria_slug_key" ON "Categoria"("slug");
