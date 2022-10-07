import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import { InjectDiscordClient } from '@discord-nestjs/core'
import {
  ChannelType,
  Client,
  Collection,
  OverwriteResolvable,
  PermissionFlagsBits,
  TextChannel,
  VoiceChannel,
} from 'discord.js'

import { MentionService } from '../mention/mention.service'
import { ChannelVisibility } from './channel.dto'

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly mentionService: MentionService,
    private readonly prisma: PrismaService
  ) {}

  async getGuild(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId)
    if (!guild) {
      this.logger.debug(`Guild ${guildId} not found`)
      throw new Error(`Guild ${guildId} not found`)
    }
    return guild
  }

  async findTextChannel(guildId: string, channelId: string) {
    const guild = await this.getGuild(guildId)
    const channel = await guild.channels.fetch(channelId, { cache: true })
    if (!channel) {
      this.logger.debug(`Text channel ${channelId} not found`)
      throw new Error(`Text channel ${channelId}  not found`)
    }
    if (channel.type !== ChannelType.GuildText) {
      this.logger.debug(`Channel ${channelId} is not a text channel`)
      throw new Error('Channel is not a text channel')
    }
    return channel as TextChannel
  }

  async findTextChannelByNumber(guildId: string, channelNumber: number) {
    const channel = await this.prisma.publicChannel.findFirst({
      select: { channelId: true },
      where: { guildId, number: channelNumber },
    })
    if (!channel) {
      this.logger.debug(`Channel ${channelNumber} not found`)
      throw new Error(`Channel ${channelNumber} not found`)
    }
    return this.findTextChannel(guildId, channel.channelId)
  }

  async getVoiceChannel(guildId: string, channelId: string) {
    if (!channelId || !guildId) {
      return null
    }
    const result = await this.prisma.voiceChannel.findUnique({
      where: { channelId_guildId: { channelId, guildId } },
    })
    const channel = await this.client.channels.fetch(channelId)
    return { channel, temporary: result?.temporary ?? false }
  }

  /**
   * Find or create a category
   * @param guildId - The guild id
   * @param categoryName - The category name
   * @returns
   */
  private async _findOrCreateCategory(guildId: string, categoryName: string) {
    const guild = await this.getGuild(guildId)
    // Find the existing category
    const existingCategory = guild.channels.cache.find(
      (channel) => channel.type === ChannelType.GuildCategory && channel.name === categoryName
    )
    if (existingCategory) return existingCategory
    // Create the category
    return guild.channels.create({
      name: categoryName,
      type: ChannelType.GuildCategory,
    })
  }

  private async _createPublicChannelInDB(guildId: string, channelId: string) {
    const result = await this.prisma.publicChannel.aggregate({
      _max: { number: true },
    })
    const maxNumber = result._max?.number + 1 ?? 0
    await this.prisma.publicChannel.create({
      data: {
        channelId: channelId,
        number: maxNumber,
        guild: {
          connectOrCreate: { where: { id: guildId }, create: { id: guildId } },
        },
      },
    })
  }

  /**
   * Create a text channel as public or private
   * @param dto - The create channel dto including guild id, channel name, creator id, and category name
   * @param visibility - The channel visibility, public or private
   * @returns
   */
  async createTextChannel(params: {
    visibility: ChannelVisibility
    guildId: string
    channelName: string
    creatorId: string
    categoryName?: string
  }) {
    const { guildId, channelName, creatorId, categoryName, visibility } = params
    const guild = await this.getGuild(guildId)
    // Define the visibility of the channel
    const permissions: OverwriteResolvable[] | Collection<string, OverwriteResolvable> = [
      { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      { id: creatorId, allow: [PermissionFlagsBits.ViewChannel] },
    ]
    // Create text channel
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: permissions,
    })
    // Create category if needed
    if (categoryName) {
      const category = await this._findOrCreateCategory(guildId, categoryName)
      await channel.setParent(category.id)
    }
    // Store channel id to database if it's public
    if (visibility === ChannelVisibility.Public) {
      await this._createPublicChannelInDB(guildId, channel.id)
    }

    return channel
  }

  /**
   * Invite a user to a text channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   * @param userId - The user id to invite
   * @param inviter - The inviter user id
   */
  async inviteToChannel(params: { guildId: string; channelId: string; mentionId: string }) {
    const { guildId, channelId, mentionId } = params
    const channel = await this.findTextChannel(guildId, channelId)
    await channel.permissionOverwrites.create(mentionId, { ViewChannel: true })
    return channel
  }

  /**
   * remove a user from a text channel
   * @param guildId - The guild id
   * @param channelId- The channel id
   * @param userId - The user id to leave
   */
  async removeFromChannel(guildId: string, channelId: string, userId: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    await channel.permissionOverwrites.delete(userId)
    return channel
  }

  /**
   * Remove a user from a text channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   * @param userId - The user id to leave
   * @param kicker - The kicker user id
   */
  async kickUserFromChannel(guildId: string, channelId: string, userId: string, kicker: string) {
    const channel = await this.removeFromChannel(guildId, channelId, userId)
    const userMention = this.mentionService.createUserMention(userId)
    const kickerMention = this.mentionService.createUserMention(kicker)
    await channel.send(`${userMention} has been kicked from this channel by ${kickerMention}`)
  }

  /**
   * Change all channel's members permission to read-only mode
   * @param guildId
   * @param channelId
   * @returns
   */
  async archiveChannel(guildId: string, channelId: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    await Promise.all(
      channel.members.map(async (member) => {
        await this.seekPublicChannel(guildId, channelId, member.id)
      })
    )
    return channel
  }

  /**
   * Delete a channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   */
  async deleteTextChannel(
    guildId: string,
    channelId: string,
    options?: {
      deleteInGuild?: boolean
    }
  ) {
    // Skip if the channel is not found
    await this.prisma.publicChannel.deleteMany({
      where: {
        channelId,
        guildId,
      },
    })
    if (options?.deleteInGuild) {
      const channel = await this.findTextChannel(guildId, channelId)
      await channel.delete()
    }
  }

  /**
   * Activate read-only mode for user for the channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   * @param userId - The user id
   * @returns
   */
  async seekPublicChannel(guildId: string, channelId: string, userId: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    if (!channel) throw new Error('Channel not found')
    await channel.permissionOverwrites.create(userId, {
      ViewChannel: true,
      SendMessages: false,
      SendMessagesInThreads: false,
      SendTTSMessages: false,
      ReadMessageHistory: true,
    })
    return channel
  }

  /**
   * Join a public channel
   * @param guildId
   * @param channelId
   * @param userId
   * @returns
   */
  async joinPubicChannel(guildId: string, channelId: string, userId: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    if (!channel) throw new Error('Channel not found')
    await channel.permissionOverwrites.create(userId, {
      ViewChannel: true,
      SendMessages: true,
      SendMessagesInThreads: true,
      SendTTSMessages: true,
    })
    return channel
  }

  /**
   * List all available public channels, delete the ones that are not available anymore
   * @param guildId - The guild id
   * @returns
   */
  async listPublicChannels(guildId: string) {
    await this._cleanupDatabasePublicChannel(guildId)

    const channels = await this.prisma.publicChannel.findMany({
      where: { guildId: guildId },
    })
    const guild = await this.getGuild(guildId)
    const guildChannels = await guild.channels.fetch()
    return channels.map((ch) => {
      const channelInfo = guildChannels.find((c) => c.id === ch.channelId)
      return {
        ...ch,
        ...channelInfo,
        parent: channelInfo.parent,
      }
    })
  }

  /**
   * Create a voice channel
   * @param params - The params
   * @returns
   */
  async createVoiceChannel(params: {
    guildId: string
    channelName: string
    categoryName?: string
    temporary?: boolean
  }) {
    const { guildId, channelName, categoryName, temporary } = params
    const guild = await this.getGuild(guildId)
    // Create voice channel
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
    })
    // Create category if needed
    if (categoryName) {
      const category = await this._findOrCreateCategory(guildId, categoryName)
      await channel.setParent(category.id)
    }
    // Store channel id to database
    await this.prisma.voiceChannel.create({
      data: {
        channelId: channel.id,
        temporary,
        guild: {
          connectOrCreate: { where: { id: guildId }, create: { id: guildId } },
        },
      },
    })
    return channel
  }

  /**
   * Delete a voice channel
   * @param guildId - The guild id
   * @param channelId - The voice channel id
   */
  async deleteVoiceChannel(guildId: string, channelId: string) {
    const { channel } = await this.getVoiceChannel(guildId, channelId)
    await channel.delete()
    await this.prisma.voiceChannel.delete({
      where: { channelId_guildId: { channelId, guildId } },
    })
  }

  /**
   * Move the user to the given voice channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   * @param userId - The user id
   */
  async moveUserToVoiceChannel(guildId: string, channelId: string, userId: string) {
    const guild = await this.getGuild(guildId)
    const channel = await guild.channels.fetch(channelId)
    if (channel instanceof VoiceChannel) {
      const user = await guild.members.fetch(userId)
      await user.voice.setChannel(channel)
    }
  }

  /**
   * Clear the non-exist public channel in the database
   * @param guildId - The guild id
   */
  private async _cleanupDatabasePublicChannel(guildId: string) {
    const dbChannels = await this.prisma.publicChannel.findMany({
      where: { guildId: guildId },
    })
    const guild = await this.getGuild(guildId)
    const guildChannels = await guild.channels.fetch()
    const unavailableChannels = dbChannels.filter(
      (channel) => !guildChannels.some((c) => c.id === channel.channelId)
    )
    await Promise.all(
      unavailableChannels.map(async (channel) => {
        await this.prisma.publicChannel.delete({
          where: {
            channelId_guildId: {
              channelId: channel.channelId,
              guildId: guildId,
            },
          },
        })
      })
    )
  }
}
