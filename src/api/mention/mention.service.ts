import { Injectable } from '@nestjs/common'

import { InjectDiscordClient } from '@discord-nestjs/core'
import { Client } from 'discord.js'

@Injectable()
export class MentionService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client
  ) {}

  getUserFromMention(mention: string | undefined) {
    if (mention?.startsWith('<@') && mention?.endsWith('>')) {
      mention = mention.slice(2, -1)
      if (mention.startsWith('!')) mention = mention.slice(1)
      return this.client.users.cache.get(mention)
    }
  }

  getChannelFromMention(mention: string | undefined) {
    if (mention?.startsWith('<#') && mention?.endsWith('>')) {
      mention = mention.slice(2, -1)
      return this.client.channels.cache.get(mention)
    }
  }

  getRoleFromMention(mention: string | undefined) {
    if (mention?.startsWith('<@&') && mention?.endsWith('>')) {
      mention = mention.slice(3, -1)
      return this.client.guilds.cache.get(mention)
    }
  }

  createUserMention(user: string) {
    return `<@${user}>`
  }
  createChannelMention(channel: string) {
    return `<#${channel}>`
  }
  createRoleMention(role: string) {
    return `<@&${role}>`
  }
}
