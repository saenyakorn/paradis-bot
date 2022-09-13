import { Injectable } from '@nestjs/common'

import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

@SubCommand({
  name: 'archive',
  description: 'Archive the channel, the users in the channel are only able to read the messages',
})
@Injectable()
export class ChannelArchieveSubCommand implements DiscordCommand {
  handler(): InteractionReplyOptions {
    return {
      content: 'Pong!',
      ephemeral: true,
    }
  }
}
