import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'

import { GuildService } from './guild.service'

@Module({
  imports: [PrismaModule],
  providers: [GuildService],
})
export class GuildModule {}
