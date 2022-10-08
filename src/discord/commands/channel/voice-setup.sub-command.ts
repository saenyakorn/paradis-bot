import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { MentionService } from '@app/api/mention/mention.service'
import { TransformPipe } from '@discord-nestjs/common'
import {
  DiscordTransformedCommand,
  Param,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

class ChannelVoiceSetupSubCommandDTO {
  @Param({ name: 'channel-name', description: 'channel name', required: true })
  channelName: string

  @Param({ name: 'category-name', description: 'category name', required: false })
  categoryName?: string
}

@SubCommand({
  name: 'voice-setup',
  description: 'Create a special voice channel',
})
@UsePipes(TransformPipe)
@Injectable()
export class ChannelVoiceSetupSubCommand
  implements DiscordTransformedCommand<ChannelVoiceSetupSubCommandDTO>
{
  private readonly logger = new Logger(ChannelVoiceSetupSubCommand.name)

  constructor(
    private readonly channelService: ChannelService,
    private readonly mentionService: MentionService
  ) {}

  async handler(
    @Payload() dto: ChannelVoiceSetupSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const { guildId } = interaction
    const { channelName, categoryName } = dto
    const channel = await this.channelService.createVoiceChannel({
      guildId,
      creatorId: interaction.user.id,
      channelName: `+ ${channelName}`,
      categoryName,
    })
    const mention = this.mentionService.createChannelMention(channel.id)
    return {
      content: `We create a voice channel for you. You can join it by clicking on the channel name: ${mention}`,
      ephemeral: true,
    }
  }
}
