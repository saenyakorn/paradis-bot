import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { IConfiguration } from './config/config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.init()

  // Get variables from
  const configService = app.get<ConfigService<IConfiguration>>(ConfigService)
  const appConfig = configService.get<IConfiguration['app']>('app')
  const { port, globalPrefix } = appConfig

  app.setGlobalPrefix(globalPrefix)

  const logger = new Logger('NestApplication')
  await app.listen(port)
  logger.log(`🚀 Application is running on: http://localhost:${port}/${globalPrefix}`)
}
bootstrap()
