/* bot.module.ts */
import { Module } from '@nestjs/common'

import { ChannelModule } from '@app/api/channel/channel.module'
import { NotificationModule } from '@app/api/notification/notification.module'
import { DiscordModule } from '@discord-nestjs/core'

import { BotSlashCommands } from './bot-slash.module'
import { BotGateway } from './bot.gateway'

@Module({
  imports: [DiscordModule.forFeature(), BotSlashCommands, ChannelModule, NotificationModule],
  providers: [BotGateway],
})
export class BotModule {}
