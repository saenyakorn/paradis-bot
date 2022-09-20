import { Injectable, UsePipes } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { TransformPipe } from '@discord-nestjs/common'
import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'

@SubCommand({
  name: 'list',
  description: 'List public text channel',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelPublicListSubCommand implements DiscordCommand {
  constructor(private readonly channelService: ChannelService) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const guildId = interaction.guildId
    const channels = await this.channelService.listPublicChannels(guildId)
    let content = channels
      .map((ch) => {
        if (ch.parent) {
          return `${ch.number}. ${ch.parent.name}/${ch.name}`
        }
        return `${ch.number}. ${ch.name}`
      })
      .join('\n')
    content = `🌈 **Public text channels** 🌈\n${content}`
    return {
      content: content || "There's no public channel",
      ephemeral: true,
    }
  }
}
