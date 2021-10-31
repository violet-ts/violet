-- CreateTable
CREATE TABLE `Project` (
    `projectId` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`projectId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Desk` (
    `deskId` VARCHAR(191) NOT NULL,
    `deskName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `projectId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`deskId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Work` (
    `workId` VARCHAR(191) NOT NULL,
    `workName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `path` VARCHAR(191) NOT NULL,
    `deskId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`workId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Revision` (
    `revisionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `workId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`revisionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Edition` (
    `editionId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revisionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`editionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `messageId` VARCHAR(191) NOT NULL,
    `cotent` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userName` VARCHAR(191) NOT NULL,
    `revisionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`messageId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reply` (
    `replyId` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userName` VARCHAR(191) NOT NULL,
    `messageId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`replyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SignedUser` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Desk` ADD FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Work` ADD FOREIGN KEY (`deskId`) REFERENCES `Desk`(`deskId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revision` ADD FOREIGN KEY (`workId`) REFERENCES `Work`(`workId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edition` ADD FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`revisionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`revisionId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD FOREIGN KEY (`messageId`) REFERENCES `Message`(`messageId`) ON DELETE CASCADE ON UPDATE CASCADE;
