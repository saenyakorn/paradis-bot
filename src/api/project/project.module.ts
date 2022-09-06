import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'

import { ProjectService } from './project.service'

@Module({
  imports: [PrismaModule],
  providers: [ProjectService],
})
export class ProjectModule {}
