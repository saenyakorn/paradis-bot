import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'

import { PingCommand } from './commands/ping/ping.command'

@Module({
  imports: [PrismaModule],
  providers: [PingCommand],
})
export class BotSlashCommands {}
