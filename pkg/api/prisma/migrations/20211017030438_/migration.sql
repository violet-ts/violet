-- DropForeignKey
ALTER TABLE `Desk` DROP FOREIGN KEY `Desk_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Edition` DROP FOREIGN KEY `Edition_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Reply` DROP FOREIGN KEY `Reply_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Revision` DROP FOREIGN KEY `Revision_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Work` DROP FOREIGN KEY `Work_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Desk` ADD CONSTRAINT `Desk_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`projectId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Work` ADD CONSTRAINT `Work_deskId_fkey` FOREIGN KEY (`deskId`) REFERENCES `Desk`(`deskId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Revision` ADD CONSTRAINT `Revision_workId_fkey` FOREIGN KEY (`workId`) REFERENCES `Work`(`workId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edition` ADD CONSTRAINT `Edition_revisionId_fkey` FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`revisionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_revisionId_fkey` FOREIGN KEY (`revisionId`) REFERENCES `Revision`(`revisionId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reply` ADD CONSTRAINT `Reply_messageId_fkey` FOREIGN KEY (`messageId`) REFERENCES `Message`(`messageId`) ON DELETE RESTRICT ON UPDATE CASCADE;
