import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

@Injectable()
export class GuildService {
  private readonly logger = new Logger(GuildService.name)

  constructor(private prisma: PrismaService) {}

  /**
   * Register the Discord guild into the application to enable other functionallities
   * @param guildId
   */
  async setup(guildId: string) {
    const found = await this.prisma.guild.findUnique({
      where: { id: guildId },
    })
    if (found) {
      this.logger.log(`Guild ${guildId} already registered`)
      throw new Error('Guild already exists')
    }

    const guild = await this.prisma.guild.create({
      data: { id: guildId },
    })

    this.logger.log(`Guild ${guild.id} registered`)
    return guild.id
  }

  /**
   * Delete all resources related to the guild
   * @param guildId
   */
  async uninstall(guildId: string) {
    const guild = await this.prisma.guild.delete({
      where: { id: guildId },
    })
    this.logger.log(`Guild ${guild.id} uninstalled`)
    return guild.id
  }
}
