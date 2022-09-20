import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async load(guildId: string) {
    return
  }
}
