/*
  Warnings:

  - You are about to alter the column `role` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Int`.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` INTEGER NOT NULL;
