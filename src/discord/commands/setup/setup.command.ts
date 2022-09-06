import { Injectable } from '@nestjs/common'

import { Command, DiscordCommand } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

@Command({
  name: 'setup',
  description: 'Pong!',
})
@Injectable()
export class SetupCommand implements DiscordCommand {
  handler(): InteractionReplyOptions {
    return {
      content: 'Pong!',
      ephemeral: true,
    }
  }
}
