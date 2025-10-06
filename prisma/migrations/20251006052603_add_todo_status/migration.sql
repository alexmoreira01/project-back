/*
  Warnings:

  - The values [ON_HOLD] on the enum `Note_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `note` MODIFY `status` ENUM('PENDING', 'TODO', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
