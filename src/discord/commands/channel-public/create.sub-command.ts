import { Injectable, Logger } from '@nestjs/common'

import { ChannelVisibility } from '@app/api/channel/channel.dto'
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

class ChannelPublicCreateSubCommandDTO {
  @Param({ name: 'channel-name', description: 'channel name', required: true })
  channelName: string

  @Param({ name: 'category-name', description: 'category name', required: false })
  categoryName?: string
}

@SubCommand({
  name: 'create',
  description: 'Create public text channel',
})
@UsePipes(TransformPipe)
@Injectable()
export class ChannelPublicCreateSubCommand
  implements DiscordTransformedCommand<ChannelPublicCreateSubCommandDTO>
{
  private readonly logger = new Logger(ChannelPublicCreateSubCommand.name)

  constructor(
    private readonly channelService: ChannelService,
    private readonly mentionService: MentionService
  ) {}

  async handler(
    @Payload() dto: ChannelPublicCreateSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    this.logger.log(`Performing "channel public create" sub-command... with ${dto}`)
    const guildId = interaction.guildId
    const creatorId = interaction.user.id
    const { channelName, categoryName } = dto

    const createdChannel = await this.channelService.createTextChannel({
      visibility: ChannelVisibility.Public,
      guildId,
      creatorId,
      channelName,
      categoryName,
    })
    const channelMention = this.mentionService.createChannelMention(createdChannel.id)
    await createdChannel.send(`Welcome to public text channel, ${channelMention}!`)
    return {
      content: `We created a public text channel ${channelMention} for you! ⭐️`,
      ephemeral: true,
    }
  }
}
