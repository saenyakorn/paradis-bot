import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { NotificationService } from '@app/api/notification/notification.service'
import { InjectDiscordClient, On, Once } from '@discord-nestjs/core'
import { Channel, ChannelType, Client } from 'discord.js'

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly channelService: ChannelService,
    private readonly notificationService: NotificationService
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`)
    // TODO load notifications into memory from database
  }

  @On('channelDelete')
  async onChannelDelete(channel: Channel) {
    if (channel.type !== ChannelType.GuildText) return
    const guildId = channel.guildId
    const channelId = channel.id
    try {
      await this.channelService.deleteChannel(guildId, channelId)
      this.logger.log(`Deleted ${channel.name} from database`)
    } catch (err) {
      this.logger.log(`Text channel ${channel.name} doesn't exist in database`)
    }
  }
}
