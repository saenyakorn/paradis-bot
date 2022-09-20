import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { MentionService } from '@app/api/mention/mention.service'
import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'

@SubCommand({
  name: 'archive',
  description: 'Archive the channel, the users in the channel are only able to read the messages',
})
@Injectable()
export class ChannelArchieveSubCommand implements DiscordCommand {
  private readonly logger = new Logger(ChannelArchieveSubCommand.name)

  constructor(
    private readonly mentionService: MentionService,
    private readonly channelService: ChannelService
  ) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    this.logger.log(`Archiving channel by ${interaction.user.id}`)

    const { guildId, channelId } = interaction

    await this.channelService.archiveChannel(guildId, channelId)
    const channelMention = this.mentionService.createChannelMention(channelId)
    const userMention = this.mentionService.createUserMention(interaction.user.id)

    return {
      content: `Archived the text channel ${channelMention} by ${userMention}`,
    }
  }
}
