import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { MentionService } from '@app/api/mention/mention.service'
import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'

@SubCommand({
  name: 'leave',
  description:
    'Leave the current channel, user will not able to read or send any menssage in this channel',
})
@Injectable()
export class ChannelLeaveSubCommand implements DiscordCommand {
  private readonly logger = new Logger(ChannelLeaveSubCommand.name)

  constructor(
    private readonly mentionService: MentionService,
    private readonly channelService: ChannelService
  ) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    this.logger.log(`${interaction.user.id} is leaving channel ${interaction.channelId}`)

    const { guildId, channelId } = interaction
    const userId = interaction.user.id

    await this.channelService.removeFromChannel(guildId, channelId, userId)

    return {
      content: `${this.mentionService.createUserMention(
        userId
      )} have left channel ${this.mentionService.createChannelMention(channelId)}`,
    }
  }
}
