/* bot.module.ts */
import { Module } from '@nestjs/common'

import { ChannelModule } from '@app/api/channel/channel.module'
import { DiscordModule } from '@discord-nestjs/core'

import { BotSlashCommands } from './bot-slash.module'
import { BotGateway } from './bot.gateway'

@Module({
  imports: [DiscordModule.forFeature(), BotSlashCommands, ChannelModule],
  providers: [BotGateway],
})
export class BotModule {}
