import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'
import { DiscordModule } from '@discord-nestjs/core'

import { NotificationService } from './notification.service'

@Module({
  imports: [DiscordModule.forFeature(), PrismaModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
