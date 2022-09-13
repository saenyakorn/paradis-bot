import { Injectable } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

@Command({
  name: 'channel',
  description: 'User registration',
  include: [BaseInfoSubCommand],
})
@Injectable()
export class ChannelCommand implements DiscordCommand {
  handler(): InteractionReplyOptions {
    return {
      content: 'Pong!',
      ephemeral: true,
    }
  }
}
