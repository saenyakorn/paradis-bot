import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { CommandInteraction } from 'discord.js'

@SubCommand({
  name: 'delete',
  description: 'Delete the current channel',
})
@Injectable()
export class ChannelDeleteSubCommand implements DiscordCommand {
  private readonly logger = new Logger(ChannelDeleteSubCommand.name)

  constructor(private readonly channelService: ChannelService) {}

  async handler(interaction: CommandInteraction) {
    this.logger.log(`Deleting channel ${interaction.channelId}`)

    const { guildId, channelId } = interaction
    try {
      await this.channelService.deleteChannel(guildId, channelId, { deleteInGuild: true })
    } catch (err) {
      this.logger.error(err)
      return {
        content: 'Error deleting channel',
      }
    }
  }
}
