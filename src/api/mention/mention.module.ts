import { Module } from '@nestjs/common'

import { DiscordModule } from '@discord-nestjs/core'

import { MentionService } from './mention.service'

@Module({
  imports: [DiscordModule.forFeature()],
  providers: [MentionService],
  exports: [MentionService],
})
export class MentionModule {}
