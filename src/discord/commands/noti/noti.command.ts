import { Injectable } from '@nestjs/common'

import { Command } from '@discord-nestjs/core'

import { NotiListSubCommand } from './list.sub-command'

export const notiSubCommands = [NotiListSubCommand]

@Command({
  name: 'noti',
  description: 'Notification management command',
  include: notiSubCommands,
})
@Injectable()
export class NotiCommand {}
