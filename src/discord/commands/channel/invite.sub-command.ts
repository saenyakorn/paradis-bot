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

class ChannelInviteSubCommandDTO {
  @Param({
    name: 'user-or-role',
    description: 'User or Role to invite',
    required: true,
    type: ParamType.MENTIONABLE,
  })
  mention: string
}

@SubCommand({
  name: 'invite',
  description: 'Invite a user or a role to the current channel',
})
@Injectable()
export class ChannelInviteSubCommand
  implements DiscordTransformedCommand<ChannelInviteSubCommandDTO>
{
  private readonly logger = new Logger(ChannelInviteSubCommand.name)

  constructor(
    private readonly mentionService: MentionService,
    private readonly channelService: ChannelService
  ) {}

  async handler(
    @Payload() dto: ChannelInviteSubCommandDTO,
    { interaction }: TransformedCommandExecutionContext
  ): Promise<InteractionReplyOptions> {
    this.logger.log(`Inviting ${dto.mention} to ${interaction.channelId}`)

    const { guildId, channelId } = interaction
    const inviterId = interaction.user.id

    if (!this.mentionService.isUser(dto.mention) && !this.mentionService.isRole(dto.mention)) {
      return {
        content: 'Please mention user or role that you want to add to this channel',
        ephemeral: true,
      }
    }

    const mentionId = this.mentionService.getMentionId(dto.mention)
    const targetChannel = await this.channelService.inviteToChannel({
      guildId,
      channelId,
      mentionId,
    })

    const inviterMention = this.mentionService.createUserMention(inviterId)
    await targetChannel.send(`${dto.mention} has been invited to this channel by ${inviterMention}`)
  }
}
