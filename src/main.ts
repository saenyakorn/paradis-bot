import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { IConfiguration } from './config/configuration'
import { PrismaService } from './prisma/prisma.service'

async function bootstrap() {
  const logger = new Logger('NestApplication')
  const app = await NestFactory.create(AppModule)
  await app.init()

  // Get services
  const prismaService = app.get(PrismaService)
  const configService = app.get<ConfigService<IConfiguration>>(ConfigService)

  // Get variables from appConfig
  const appConfig = configService.get<IConfiguration['app']>('app')
  const { port, globalPrefix } = appConfig

  // Setting
  app.setGlobalPrefix(globalPrefix)
  await prismaService.enableShutdownHooks(app)

  await app.listen(port)
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}
bootstrap()
