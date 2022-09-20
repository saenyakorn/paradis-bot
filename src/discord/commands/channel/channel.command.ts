import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { ChannelArchieveSubCommand } from './archive.sub-command'

@Command({
  name: 'channel',
  description: 'User registration',
  include: [ChannelArchieveSubCommand],
})
@Injectable()
export class ChannelCommand {}
