import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { DiscordModule } from '@discord-nestjs/core'

import { EpicModule } from './api/epic/epic.module'
import { GuildModule } from './api/guild/guild.module'
import { GuildService } from './api/guild/guild.service'
import { ProjectModule } from './api/project/project.module'
import { TaskModule } from './api/task/task.module'
import { UserModule } from './api/user/user.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { configuration } from './config/configuration'
import { BotSlashCommands } from './discord/bot-slash.module'
import { DiscordConfigService } from './discord/discord-config.service'
import { LoggerMiddleware } from './logger/logger.middleware'
import { PrismaModule } from './prisma/prisma.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule, PrismaModule],
      inject: [ConfigService],
      useClass: DiscordConfigService,
    }),
    BotSlashCommands,
    PrismaModule,
    GuildModule,
    TaskModule,
    EpicModule,
    UserModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService, GuildService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
