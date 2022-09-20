import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { MentionService } from '@app/api/mention/mention.service'
import {
  DiscordTransformedCommand,
  Param,
  ParamType,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

class ChannelKickSubCommandDTO {
  @Param({
    name: 'user-or-role',
    description: 'User or Role to kick',
    required: true,
    type: ParamType.MENTIONABLE,
  })
  mention: string
}

@SubCommand({
  name: 'kick',
  description: 'Kick the user from the current channel',
})
@Injectable()
export class ChannelKickSubCommand implements DiscordTransformedCommand<ChannelKickSubCommandDTO> {
  private readonly logger = new Logger(ChannelKickSubCommand.name)

  constructor(
    private readonly mentionService: MentionService,
    private readonly channelService: ChannelService
  ) {}

  async handler(
    @Payload() dto: ChannelKickSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const { guildId, channelId } = interaction
    const userId = interaction.user.id

    if (!this.mentionService.isUser(dto.mention) && !this.mentionService.isRole(dto.mention)) {
      return {
        content: 'Please mention user or role that you want to kick from this channel',
        ephemeral: true,
      }
    }
    const mentionId = this.mentionService.getMentionId(dto.mention)
    this.logger.log(`${userId} is kicking ${mentionId} channel ${channelId}`)

    await this.channelService.removeFromChannel(guildId, channelId, userId)

    return {
      content: `User ${mentionId} has been kicked from this channel`,
    }
  }
}
