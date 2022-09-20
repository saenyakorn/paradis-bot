import { Module } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import { DiscordModule } from '@discord-nestjs/core'

import { MentionModule } from '../mention/mention.module'
import { ChannelService } from './channel.service'

@Module({
  imports: [DiscordModule.forFeature(), MentionModule],
  providers: [ChannelService, PrismaService],
  exports: [ChannelService],
})
export class ChannelModule {}
