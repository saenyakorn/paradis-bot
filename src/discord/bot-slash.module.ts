import { Module } from '@nestjs/common'

import { ChannelModule } from '@app/api/channel/channel.module'
import { MentionModule } from '@app/api/mention/mention.module'
import { NotificationModule } from '@app/api/notification/notification.module'
import { PrismaModule } from '@app/prisma/prisma.module'
import { ReflectMetadataProvider, registerFilterGlobally } from '@discord-nestjs/core'

import {
  ChannelPrivateCommand,
  channelPrivateSubCommands,
} from './commands/channel-private/channel-private.sub-command'
import {
  ChannelPublicCommand,
  channelPublicSubCommands,
} from './commands/channel-public/channel-public.command'
import { ChannelCommand, channelSubCommands } from './commands/channel/channel.command'
// import { NotiCommand, notiSubCommands } from './commands/noti/noti.command'
import { PingCommand } from './commands/ping/ping.command'
import { CommandErrorFilter } from './filters/common-error.filter'

@Module({
  imports: [PrismaModule, ChannelModule, MentionModule, NotificationModule],
  providers: [
    ReflectMetadataProvider,
    PingCommand,
    /** Common Channel Command */
    ChannelCommand,
    ...channelSubCommands,
    /** Public Channel Command */
    ChannelPublicCommand,
    ...channelPublicSubCommands,
    /** Private Channel Command */
    ChannelPrivateCommand,
    ...channelPrivateSubCommands,
    /** Notification Command */
    // NotiCommand,
    // ...notiSubCommands,
    {
      provide: registerFilterGlobally(),
      useClass: CommandErrorFilter,
    },
  ],
})
export class BotSlashCommands {}
