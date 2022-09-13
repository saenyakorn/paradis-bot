import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { DiscordModule } from '@discord-nestjs/core'

import { ChannelModule } from './api/channel/channel.module'
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
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
