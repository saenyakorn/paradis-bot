import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { ChannelPrivateCreateSubCommand } from './create.sub-command'

export const channelPrivateSubCommands = [ChannelPrivateCreateSubCommand]

@Command({
  name: 'channel-private',
  description: 'Private channel management command',
  include: channelPrivateSubCommands,
})
@Injectable()
export class ChannelPrivateCommand {}
