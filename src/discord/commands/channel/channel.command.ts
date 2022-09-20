import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { ChannelArchieveSubCommand } from './archive.sub-command'
import { ChannelDeleteSubCommand } from './delete.sub-command'
import { ChannelInviteSubCommand } from './invite.sub-command'
import { ChannelKickSubCommand } from './kick.sub-command'
import { ChannelLeaveSubCommand } from './leave.sub-command'

export const channelSubCommands = [
  ChannelArchieveSubCommand,
  ChannelInviteSubCommand,
  ChannelLeaveSubCommand,
  ChannelKickSubCommand,
  ChannelDeleteSubCommand,
]
@Command({
  name: 'channel',
  description: 'Common channel management commands',
  include: channelSubCommands,
})
@Injectable()
export class ChannelCommand {}
