import { Module } from '@nestjs/common'

import { ChannelModule } from '@app/api/channel/channel.module'
import { MentionModule } from '@app/api/mention/mention.module'
import { PrismaModule } from '@app/prisma/prisma.module'
import { ReflectMetadataProvider } from '@discord-nestjs/core'

import {
  ChannelPublicCommand,
  channelPublicSubCommands,
} from './commands/channel-public/channel-public.command'
import { PingCommand } from './commands/ping/ping.command'

@Module({
  imports: [PrismaModule, ChannelModule, MentionModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    /** Public Channel subcommand */
    ChannelPublicCommand,
    ...channelPublicSubCommands,
  ],
})
export class BotSlashCommands {}
