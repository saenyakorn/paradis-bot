import { Injectable, Logger } from '@nestjs/common'

import { ChannelService } from '@app/api/channel/channel.service'
import { InjectDiscordClient, On, Once } from '@discord-nestjs/core'
import { Channel, ChannelType, Client, VoiceState } from 'discord.js'

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name)

  constructor(
    @InjectDiscordClient()
    private readonly client: Client,
    private readonly channelService: ChannelService
  ) {}

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started!`)
    // TODO load notifications into memory from database
  }

  @On('channelDelete')
  async onChannelDelete(channel: Channel) {
    if (channel.type === ChannelType.DM) return
    const channelId = channel.id
    try {
      if (channel.type === ChannelType.GuildText) {
        await this.channelService.deleteTextChannel(channel.guildId, channelId)
        this.logger.log(`Deleted text channel ${channel.name} from database`)
        return
      }
      if (channel.type === ChannelType.GuildVoice) {
        await this.channelService.deleteVoiceChannel(channel.guildId, channelId)
        this.logger.log(`Deleted voice channel ${channel.name} from database`)
        return
      }
    } catch (err) {
      this.logger.log(`A channel ${channel.name} doesn't exist in database`)
    }
  }

  @On('voiceStateUpdate')
  async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    const [oldVoiceChannel, newVoiceChannel] = await Promise.all([
      this.channelService.getVoiceChannel(oldState.guild.id, oldState.channelId),
      this.channelService.getVoiceChannel(newState.guild.id, newState.channelId),
    ])

    // user join the voice channel or change the voice channel
    if (newVoiceChannel) {
      // user join the special voice channel
      if (!newVoiceChannel.temporary) {
        const guildId = newState.guild.id
        const username = newState.member.user.username
        const userId = newState.member.user.id

        const ownTemporaryChannel = await this.channelService.findOwnTemporaryVoiceChannel(
          guildId,
          userId
        )

        if (ownTemporaryChannel) {
          await this.channelService.moveUserToVoiceChannel(
            guildId,
            ownTemporaryChannel.channelId,
            userId
          )
          return
        }

        const temporaryChannel = await this.channelService.createVoiceChannel({
          guildId: guildId,
          channelName: `${username}'s channel`,
          creatorId: userId,
          temporary: true,
        })
        // Move user to the temporary channel
        await this.channelService.moveUserToVoiceChannel(guildId, temporaryChannel.id, userId)
        return
      }

      // user join the temporary voice channel
      if (newVoiceChannel.temporary) {
        return
      }
    }

    // user leave the voice channel
    if (!newVoiceChannel && oldVoiceChannel) {
      const voiceChannel = await this.channelService.getVoiceChannel(
        oldState.guild.id,
        oldState.channelId
      )

      // user leave the special voice channel
      if (!voiceChannel?.temporary) {
        return
      }

      // user leave the temporary voice channel
      if (voiceChannel.temporary) {
        const members = oldState.channel.members
        if (members.size === 0) {
          await this.channelService.deleteVoiceChannel(oldState.guild.id, oldState.channelId, {
            deleteInGuild: true,
          })
        }
        return
      }
    }
  }
}
