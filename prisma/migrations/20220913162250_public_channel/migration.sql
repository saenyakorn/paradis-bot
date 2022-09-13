/*
  Warnings:

  - The primary key for the `PublicChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `channelId` to the `PublicChannel` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `PublicChannel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PublicChannel" DROP CONSTRAINT "PublicChannel_pkey",
ADD COLUMN     "channelId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" INTEGER NOT NULL,
ADD CONSTRAINT "PublicChannel_pkey" PRIMARY KEY ("id", "channelId", "guildId");
