import { Module } from '@nestjs/common'

import { GuildService } from './guild.service'

@Module({
  providers: [GuildService],
})
export class GuildModule {}
