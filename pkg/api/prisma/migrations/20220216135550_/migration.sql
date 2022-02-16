-- CreateTable
CREATE TABLE `UpdateHistory` (
    `historyId` VARCHAR(191) NOT NULL,
    `projectId` VARCHAR(191) NOT NULL,
    `projectName` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`historyId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
