import { Injectable, Logger } from '@nestjs/common'
import { SchedulerRegistry } from '@nestjs/schedule'

import { PrismaService } from '@app/prisma/prisma.service'
import { at } from '@app/utils/cron'
import { InjectDiscordClient } from '@discord-nestjs/core'
import { CronJob } from 'cron'
import { isBefore } from 'date-fns'
import { ChannelType, Client } from 'discord.js'

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly prisma: PrismaService,
    private readonly schedulerRegistry: SchedulerRegistry
  ) {}

  /**
   * Load all notifications from the database, when start the server
   * @param guildId
   * @returns
   */
  async load(guildId: string) {
    const notifications = await this.prisma.notificationPause.findMany({
      where: { guildId },
    })
    await Promise.all(
      notifications.map(async (notification) => {
        const { userId, endDate, channelId } = notification
        if (isBefore(endDate, new Date())) {
          await this.removePauseNotification(guildId, userId, channelId)
        } else {
          await this.createDelayedNotification(guildId, userId, endDate, channelId)
        }
      })
    )
    this.logger.log(`Loaded ${notifications.length} notifications`)
  }

  /**
   * Pause notification
   * @param guildId - The guild id
   * @param userId - The user id
   * @param endDate - The end date of the pause
   * @param channelId - The channel id
   */
  async addPauseNotification(guildId: string, userId: string, endDate: Date, channelId?: string) {
    await this.prisma.notificationPause.create({
      data: { guildId, userId, endDate, channelId },
    })
  }

  /**
   * Pause notification
   * @param guildId - The guild id
   * @param userId - The user id
   * @param endDate - The end date of the pause
   * @param channelId - The channel id
   */
  async removePauseNotification(guildId: string, userId: string, channelId?: string) {
    await this.prisma.notificationPause.deleteMany({
      where: { userId, guildId, channelId },
    })
  }

  /**
   * Pause notification
   * @param guildId - The guild id
   * @param userId - The user id
   * @param endDate - The end date of the pause
   * @param channelId - The channel id
   */
  async createDelayedNotification(
    guildId: string,
    userId: string,
    endDate: Date,
    channelId?: string
  ) {
    const name = `notification-${guildId}-${userId}-${channelId}`

    if (this.schedulerRegistry.getCronJob(name)) {
      this.schedulerRegistry.deleteCronJob(name)
    }

    const job = new CronJob(at(endDate), async () => {
      await this.removePauseNotification(guildId, userId, channelId)
      job.stop()
      this.schedulerRegistry.deleteCronJob(name)
    })

    this.schedulerRegistry.addCronJob(name, job)
    job.start()
  }

  /**
   * List all notification setting for a user
   * @param guildId - The guild id
   * @param userId - The user id
   * @returns
   */
  async list(guildId: string, userId: string) {
    const guild = await this.client.guilds.fetch(guildId)
    const channels = await guild.channels.fetch()
    const textChannels = channels.filter(
      (channel) =>
        channel.type === ChannelType.GuildText &&
        channel.members.some((member) => member.id === userId)
    )

    const notifications = await this.prisma.notificationPause.findMany({
      where: { guildId, userId },
    })

    const channelNotifications = textChannels.map((ch) => {
      const n = notifications.find((n) => n.channelId === ch.id)
      return { channel: ch, endDate: n?.endDate }
    })

    return channelNotifications
  }
}
