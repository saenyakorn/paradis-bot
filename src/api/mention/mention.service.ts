import { Injectable } from '@nestjs/common'

import { InjectDiscordClient } from '@discord-nestjs/core'
import { Client } from 'discord.js'

@Injectable()
export class MentionService {
  constructor(
    @InjectDiscordClient()
    private readonly client: Client
  ) {}

  isUser(mention: string) {
    return mention.startsWith('<@') && mention?.endsWith('>')
  }
  isRole(mention: string) {
    return mention.startsWith('<@&') && mention?.endsWith('>')
  }
  isChannel(mention: string) {
    return mention.startsWith('<#') && mention?.endsWith('>')
  }

  getUserFromMention(mention: string) {
    if (this.isUser(mention)) {
      mention = mention.slice(2, -1)
      if (mention.startsWith('!')) mention = mention.slice(1)
      return this.client.users.cache.get(mention)
    }
  }
  getChannelFromMention(mention: string) {
    if (this.isChannel(mention)) {
      mention = mention.slice(2, -1)
      return this.client.channels.cache.get(mention)
    }
  }
  getRoleFromMention(mention: string) {
    if (this.isRole(mention)) {
      mention = mention.slice(3, -1)
      return this.client.guilds.cache.get(mention)
    }
  }

  getMentionId(mention: string) {
    if (this.isUser(mention)) {
      return this.getUserFromMention(mention)?.id
    } else if (this.isChannel(mention)) {
      return this.getChannelFromMention(mention)?.id
    } else if (this.isRole(mention)) {
      return this.getRoleFromMention(mention)?.id
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
