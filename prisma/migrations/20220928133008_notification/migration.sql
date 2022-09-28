/*
  Warnings:

  - You are about to drop the column `pause` on the `NotificationPause` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `NotificationPause` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NotificationPause" DROP COLUMN "pause",
ADD COLUMN     "channelId" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
