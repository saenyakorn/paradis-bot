import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { ChannelPublicCreateSubCommand } from './create.sub-command'
import { ChannelPublicJoinSubCommand } from './join.sub-command'
import { ChannelPublicListSubCommand } from './list.sub-command'
import { ChannelPublicSeekSubCommand } from './seek.sub-command'

export const channelPublicSubCommands = [
  ChannelPublicCreateSubCommand,
  ChannelPublicJoinSubCommand,
  ChannelPublicListSubCommand,
  ChannelPublicSeekSubCommand,
]

@Command({
  name: 'channel-public',
  description: 'Public channel management command',
  include: channelPublicSubCommands,
})
@Injectable()
export class ChannelPublicCommand {}
