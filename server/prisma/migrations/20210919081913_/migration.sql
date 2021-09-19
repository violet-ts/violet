/*
  Warnings:

  - You are about to drop the column `editionsId` on the `Revision` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `revisionId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Message` ADD COLUMN `revisionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Revision` DROP COLUMN `editionsId`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Edition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `revisionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `replyDate` DATETIME(3) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `messageId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SignedUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Edition` ADD FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD FOREIGN KEY (`messageId`) REFERENCES `Message`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
