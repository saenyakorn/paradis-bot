import { Injectable } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  /**
   * Register the Discord user into the application
   * @param guildId
   * @param discordId
   * @param githubUsername
   */
  async register(guildId: string, discordId: string, githubUsername: string) {
    const user = await this.prisma.user.create({
      data: {
        id: discordId,
        github: githubUsername,
        Guilds: { connect: { id: guildId } },
      },
    })
    return user
  }

  /**
   *
   * @param guildId
   * @param discordId
   */
  async unregister(guildId: string, discordId: string) {
    const user = await this.prisma.guild.update({
      where: { id: guildId },
      data: {
        Users: { disconnect: { id: discordId } },
      },
    })
    return user
  }

  /**
   * Get the user information in the given guild
   * @param guildId
   * @param discordId
   * @returns
   */
  async getUserInfo(guildId: string, discordId: string) {
    const { Guilds: _, ...user } = await this.prisma.user.findUnique({
      where: { id: discordId },
      include: { Guilds: { where: { id: guildId } } },
    })
    return user
  }

  /**
   * Update the user information in the given guild
   * @param guildId
   * @param discordId
   * @param githubUsername
   * @returns
   */
  async updateGithubUsername(guildId: string, discordId: string, githubUsername: string) {
    const user = await this.prisma.user.update({
      where: { id: discordId },
      data: { github: githubUsername },
      include: { Guilds: { where: { id: guildId } } },
    })
    return user
  }
}
