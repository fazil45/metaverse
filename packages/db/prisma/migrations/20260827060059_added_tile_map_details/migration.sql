/*
  Warnings:

  - You are about to drop the column `position` on the `Element` table. All the data in the column will be lost.
  - Added the required column `collides` to the `Element` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tiledJsonUrl` to the `Map` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tilesetImageUrl` to the `Map` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Element" DROP COLUMN "position",
ADD COLUMN     "collides" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "Map" ADD COLUMN     "tiledJsonUrl" TEXT NOT NULL,
ADD COLUMN     "tilesetImageUrl" TEXT NOT NULL;
