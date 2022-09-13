import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'
import { InjectDiscordClient } from '@discord-nestjs/core'
import {
  ChannelType,
  Client,
  Collection,
  OverwriteResolvable,
  PermissionFlagsBits,
  TextChannel,
} from 'discord.js'

import { MentionService } from '../mention/mention.service'
import { ChannelVisibility, CreateChannelDTO } from './channel.dto'

@Injectable()
export class ChannelService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly mentionService: MentionService,
    private readonly prisma: PrismaService
  ) {}

  async getGuild(guildId: string) {
    const guild = await this.client.guilds.fetch(guildId)
    if (!guild) throw new Error('Guild not found')
    return guild
  }

  async findTextChannel(guildId: string, channelId: string) {
    const guild = await this.getGuild(guildId)
    const channel = await guild.channels.fetch(channelId, { cache: true })
    if (!channel) throw new Error('Channel not found')
    if (channel.type !== ChannelType.GuildText) throw new Error('Channel is not a text channel')
    return channel as TextChannel
  }

  /**
   * Find or create a category
   * @param guildId - The guild id
   * @param categoryName - The category name
   * @returns
   */
  async _findOrCreateCategory(guildId: string, categoryName: string) {
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

  async createPublicChannelForDB(guildId: string, channelId: string) {
    const {
      _max: { number: maxNumber },
    } = await this.prisma.publicChannel.aggregate({
      _max: { number: true },
    })
    await this.prisma.publicChannel.create({
      data: { guildId: guildId, channelId: channelId, number: maxNumber },
    })
  }

  /**
   * Create a text channel as public or private
   * @param dto - The create channel dto including guild id, channel name, creator id, and category name
   * @param visibility - The channel visibility, public or private
   * @returns
   */
  async createChannel(dto: CreateChannelDTO, visibility: ChannelVisibility) {
    const guild = await this.getGuild(dto.guildId)
    // Define the visibility of the channel
    const permissions: OverwriteResolvable[] | Collection<string, OverwriteResolvable> = [
      { id: guild.roles.everyone, deny: [PermissionFlagsBits.ViewChannel] },
      { id: dto.creatorId, allow: [PermissionFlagsBits.ViewChannel] },
    ]
    // Create text channel
    const channel = await guild.channels.create({
      name: dto.channelName,
      type: ChannelType.GuildText,
      permissionOverwrites: permissions,
    })
    // Create category if needed
    if (dto.categoryName) {
      const category = await this._findOrCreateCategory(dto.guildId, dto.categoryName)
      await channel.setParent(category.id)
    }
    // Store channel id to database if it's public
    if (visibility === ChannelVisibility.Public) {
      await this.createPublicChannelForDB(dto.guildId, channel.id)
    }
    await channel.send(`Welcome to ${channel.name}!`)
    return channel
  }

  /**
   * Invite a user to a text channel
   * @param guildId - The guild id
   * @param channelId - The channel id
   * @param userId - The user id to invite
   * @param inviter - The inviter user id
   */
  async inviteUserToChannel(guildId: string, channelId: string, userId: string, inviter: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    await channel.permissionOverwrites.create(userId, { ViewChannel: true })
    const userMention = this.mentionService.createUserMention(userId)
    const inviterMention = this.mentionService.createUserMention(inviter)
    await channel.send(`${userMention} has been invited to this channel by ${inviterMention}`)
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
  async deleteChannel(guildId: string, channelId: string) {
    const channel = await this.findTextChannel(guildId, channelId)
    await channel.delete()
    await this.prisma.publicChannel.delete({
      where: {
        channelId_guildId: {
          channelId: channelId,
          guildId: guildId,
        },
      },
    })
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
   * List all available public channels
   * @param guildId - The guild id
   * @returns
   */
  async listPublicChannels(guildId: string) {
    const channels = await this.prisma.publicChannel.findMany({
      where: { guildId: guildId },
    })
    const guild = await this.getGuild(guildId)
    const allChannels = await guild.channels.fetch()
    return allChannels.filter((channel) => channels.some((c) => c.channelId === channel.id))
  }
}
