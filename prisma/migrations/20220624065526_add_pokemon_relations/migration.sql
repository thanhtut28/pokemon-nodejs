/*
  Warnings:

  - You are about to drop the column `voteAgainst` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `voteFor` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[votedForId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[votedAgainstId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `votedAgainstId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votedForId` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vote` DROP COLUMN `voteAgainst`,
    DROP COLUMN `voteFor`,
    ADD COLUMN `votedAgainstId` INTEGER NOT NULL,
    ADD COLUMN `votedForId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Pokemon` (
    `id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `spriteUrl` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Vote_votedForId_key` ON `Vote`(`votedForId`);

-- CreateIndex
CREATE UNIQUE INDEX `Vote_votedAgainstId_key` ON `Vote`(`votedAgainstId`);
