import { Injectable, Logger } from '@nestjs/common'

import { PrismaService } from '@app/prisma/prisma.service'

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name)
  constructor(private prisma: PrismaService) {}

  /**
   * Create a project within the given guild
   * @param guildId
   * @param name
   * @returns
   */
  async create(guildId: string, name: string) {
    const project = await this.prisma.project.create({
      data: {
        name,
        Guild: { connect: { id: guildId } },
      },
    })

    this.logger.log(`Project ${project.name} created`)
    return project
  }

  /**
   * Delete a project within the given guild
   * @param guildId
   * @param projectId
   */
  async delete(guildId: string, projectId: string) {
    await this.prisma.guild.update({
      where: { id: guildId },
      data: { Projects: { delete: { id: projectId } } },
    })

    this.logger.log(`Project ${projectId} deleted`)
  }
}
