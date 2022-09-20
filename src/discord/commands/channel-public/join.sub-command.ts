import { Injectable } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { MentionService } from '@app/api/mention/mention.service'
import { TransformPipe } from '@discord-nestjs/common'
import {
  DiscordTransformedCommand,
  Param,
  ParamType,
  Payload,
  SubCommand,
  TransformedCommandExecutionContext,
  UsePipes,
} from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

class ChannelPublicJoinSubCommandDTO {
  @Param({
    name: 'channel-number',
    description: 'Channel number to join',
    required: true,
    type: ParamType.NUMBER,
  })
  channelNumber: number
}

@SubCommand({
  name: 'join',
  description: 'Join public text channel',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelPublicJoinSubCommand
  implements DiscordTransformedCommand<ChannelPublicJoinSubCommandDTO>
{
  constructor(
    private readonly channelService: ChannelService,
    private readonly mentionService: MentionService
  ) {}

  async handler(
    @Payload() dto: ChannelPublicJoinSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const { channelNumber } = dto
    const guildId = interaction.guildId
    const userId = interaction.user.id
    const channel = await this.channelService.findTextChannelByNumber(guildId, channelNumber)
    await this.channelService.joinPubicChannel(guildId, channel.id, userId)
    return {
      content: `You joint the public text channel ${this.mentionService.createChannelMention(
        channel.id
      )}`,
      ephemeral: true,
    }
  }
}
