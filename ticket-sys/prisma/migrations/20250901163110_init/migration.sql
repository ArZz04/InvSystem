/*
  Warnings:

  - The values [administrador,almacenista,auxiliar,vendedor] on the enum `User_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `User` MODIFY `role` ENUM('0', '1', '2', '3') NOT NULL;
