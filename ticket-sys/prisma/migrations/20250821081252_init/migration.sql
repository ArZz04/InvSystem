/*
  Warnings:

  - You are about to drop the `Usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Usuario`;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastNameP` VARCHAR(191) NOT NULL,
    `lastNameM` VARCHAR(191) NOT NULL,
    `passHash` VARCHAR(191) NOT NULL,
    `birthDay` INTEGER NOT NULL,
    `birthMonth` INTEGER NOT NULL,
    `birthYear` INTEGER NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `role` ENUM('administrador', 'almacenista', 'auxiliar', 'vendedor') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
