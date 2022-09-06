import { Module } from '@nestjs/common'

import { PrismaModule } from '@app/prisma/prisma.module'

import { UserService } from './user.service'

@Module({
  imports: [PrismaModule],
  providers: [UserService],
})
export class UserModule {}
