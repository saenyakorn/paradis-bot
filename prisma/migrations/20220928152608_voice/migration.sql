-- CreateTable
CREATE TABLE "VoiceChannel" (
    "channelId" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "VoiceChannel_pkey" PRIMARY KEY ("channelId","guildId")
);

-- AddForeignKey
ALTER TABLE "VoiceChannel" ADD CONSTRAINT "VoiceChannel_guildId_fkey" FOREIGN KEY ("guildId") REFERENCES "Guild"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
