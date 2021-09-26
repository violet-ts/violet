/*
  Warnings:

  - You are about to drop the column `cotent` on the `Message` table. All the data in the column will be lost.
  - Added the required column `content` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` DROP COLUMN `cotent`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL;
