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

export class ChannelPublicSeekSubCommandDTO {
  @Param({
    name: 'channel-number',
    description: 'Channel number to join',
    required: true,
    type: ParamType.NUMBER,
  })
  channelNumber: number
}

@SubCommand({
  name: 'seek',
  description: 'Seek public text channel',
})
@Injectable()
@UsePipes(TransformPipe)
export class ChannelPublicSeekSubCommand
  implements DiscordTransformedCommand<ChannelPublicSeekSubCommandDTO>
{
  constructor(
    private readonly channelService: ChannelService,
    private readonly mentionService: MentionService
  ) {}

  async handler(
    @Payload() dto: ChannelPublicSeekSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    const { channelNumber } = dto
    const guildId = interaction.guildId
    const seekerId = interaction.user.id
    const channel = await this.channelService.findTextChannelByNumber(guildId, channelNumber)
    await this.channelService.seekPublicChannel(guildId, channel.id, seekerId)
    return {
      content: `You seek the public text channel ${this.mentionService.createChannelMention(
        channel.id
      )}`,
      ephemeral: true,
    }
  }
}
