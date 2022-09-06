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

  /**
   * Get all projects in the given guild
   * @param guildId
   * @returns
   */
  async getProjects(guildId: string) {
    const { Projects } = await this.prisma.guild.findUnique({
      include: { Projects: true },
      where: { id: guildId },
    })
    return Projects
  }

  /**
   * Get all epics in the given guild
   * @param guildId
   * @returns
   */
  async getEpics(guildId: string) {
    const { Epics } = await this.prisma.guild.findUnique({
      include: { Epics: true },
      where: { id: guildId },
    })
    return Epics
  }

  /**
   * Get all users in the given guild
   * @param guildId
   * @returns
   */
  async getUsers(guildId: string) {
    const { Users } = await this.prisma.guild.findUnique({
      include: { Users: true },
      where: { id: guildId },
    })
    return Users
  }

  /**
   * Get all tasks in the given guild
   * @param guildId
   * @returns
   */
  async getTasks(guildId: string) {
    const { Tasks } = await this.prisma.guild.findUnique({
      include: { Tasks: true },
      where: { id: guildId },
    })
    return Tasks
  }
}
