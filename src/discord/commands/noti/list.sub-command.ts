import { Injectable, UsePipes } from '@nestjs/common'

import { MentionService } from '@app/api/mention/mention.service'
import { NotificationService } from '@app/api/notification/notification.service'
import { TransformPipe } from '@discord-nestjs/common'
import { DiscordCommand, SubCommand } from '@discord-nestjs/core'
import { formatRelative } from 'date-fns'
import { CommandInteraction, InteractionReplyOptions } from 'discord.js'

@SubCommand({
  name: 'list',
  description: 'List channel notification settings',
})
@Injectable()
@UsePipes(TransformPipe)
export class NotiListSubCommand implements DiscordCommand {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly mentionService: MentionService
  ) {}

  async handler(interaction: CommandInteraction): Promise<InteractionReplyOptions> {
    const guildId = interaction.guildId
    const userId = interaction.user.id

    const notis = await this.notificationService.list(guildId, userId)

    let content = notis
      .map((noti) => {
        const channelId = noti.channel.id
        const notification = noti.endDate ? formatRelative(noti.endDate, new Date()) : 'Default'
        return `${this.mentionService.createChannelMention(channelId)}: ${notification}`
      })
      .join('\n')
    content = `🌈 **Notification Settings** 🌈\n${content}`
    return {
      content: content || "There's notification setting",
      ephemeral: true,
    }
  }
}
