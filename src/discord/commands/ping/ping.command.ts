import { Injectable } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

@Command({
  name: 'ping',
  description: 'Pong!',
})
@Injectable()
export class PingCommand implements DiscordCommand {
  handler(): InteractionReplyOptions {
    return {
      content: 'Pong!',
      ephemeral: true,
    }
  }
}
