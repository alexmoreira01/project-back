/*
  Warnings:

  - You are about to alter the column `category` on the `note` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `note` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `category` ENUM('note', 'task') NULL;
