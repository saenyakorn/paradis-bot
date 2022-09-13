/*
  Warnings:

  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `github` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Epic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `History` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Task` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserEpic` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserProject` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserTask` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GuildToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Epic" DROP CONSTRAINT "Epic_guildId_fkey";

-- DropForeignKey
ALTER TABLE "Epic" DROP CONSTRAINT "Epic_projectId_fkey";

-- DropForeignKey
ALTER TABLE "History" DROP CONSTRAINT "History_userId_fkey";

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_guildId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_epicId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_guildId_fkey";

-- DropForeignKey
ALTER TABLE "UserEpic" DROP CONSTRAINT "UserEpic_epicId_fkey";

-- DropForeignKey
ALTER TABLE "UserEpic" DROP CONSTRAINT "UserEpic_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_projectId_fkey";

-- DropForeignKey
ALTER TABLE "UserProject" DROP CONSTRAINT "UserProject_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserTask" DROP CONSTRAINT "UserTask_taskId_fkey";

-- DropForeignKey
ALTER TABLE "UserTask" DROP CONSTRAINT "UserTask_userId_fkey";

-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GuildToUser" DROP CONSTRAINT "_GuildToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdAt",
DROP COLUMN "email",
DROP COLUMN "github",
DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "Epic";

-- DropTable
DROP TABLE "History";

-- DropTable
DROP TABLE "Project";

-- DropTable
DROP TABLE "Task";

-- DropTable
DROP TABLE "UserEpic";

-- DropTable
DROP TABLE "UserProject";

-- DropTable
DROP TABLE "UserTask";

-- DropTable
DROP TABLE "_GuildToUser";

-- CreateTable
CREATE TABLE "PublicChannel" (
    "id" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "PublicChannel_pkey" PRIMARY KEY ("id","guildId")
);

-- CreateTable
CREATE TABLE "NotificationPause" (
    "userId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,
    "pause" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPause_pkey" PRIMARY KEY ("userId","guildId")
);

-- AddForeignKey
ALTER TABLE "PublicChannel" ADD CONSTRAINT "PublicChannel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPause" ADD CONSTRAINT "NotificationPause_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPause" ADD CONSTRAINT "NotificationPause_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
