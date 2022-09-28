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
    if (channel.type !== ChannelType.GuildText) return
    const guildId = channel.guildId
    const channelId = channel.id
    try {
      await this.channelService.deleteTextChannel(guildId, channelId)
      this.logger.log(`Deleted ${channel.name} from database`)
    } catch (err) {
      this.logger.log(`Text channel ${channel.name} doesn't exist in database`)
    }
  }

  @On('voiceStateUpdate')
  async onVoiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
    console.log('Someone joined a voice channel')
    console.log(oldState, newState)
    const targetVc = await this.channelService.getVoiceChannel(
      newState.guild.id,
      newState.channelId
    )
    if (!targetVc) return
    // If user is not in the temporary voice channel anymore
    const oldVc = await this.channelService.getVoiceChannel(oldState.guild.id, oldState.channelId)
    if (oldVc.temporary) {
      const members = oldState.channel.members
      if (members.size === 0) {
        await this.channelService.deleteVoiceChannel(oldState.guild.id, oldState.channelId)
      }
      return
    }
    // If user is entering the special voice channel, create a new temporary voice channel
    const guildId = newState.guild.id
    const username = newState.member.user.username
    const userId = newState.member.user.id
    const channel = await this.channelService.createVoiceChannel({
      guildId: guildId,
      channelName: `${username} channel`,
      temporary: true,
    })
    // Move user to the temporary channel
    await this.channelService.moveUserToVoiceChannel(guildId, channel.id, userId)
  }
}
