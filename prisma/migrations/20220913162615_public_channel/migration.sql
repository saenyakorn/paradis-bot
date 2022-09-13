/*
  Warnings:

  - The primary key for the `PublicChannel` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `PublicChannel` table. All the data in the column will be lost.
  - Added the required column `number` to the `PublicChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublicChannel" DROP CONSTRAINT "PublicChannel_pkey",
DROP COLUMN "id",
ADD COLUMN     "number" INTEGER NOT NULL,
ADD CONSTRAINT "PublicChannel_pkey" PRIMARY KEY ("channelId", "guildId");
