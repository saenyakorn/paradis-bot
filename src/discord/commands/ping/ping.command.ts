import { Injectable, Logger } from '@nestjs/common'

import { TransformPipe } from '@discord-nestjs/common'
import { Command, DiscordTransformedCommand, Param, Payload, UsePipes } from '@discord-nestjs/core'
import { InteractionReplyOptions } from 'discord.js'

class PingDTO {
  @Param({ description: 'content you want to ping' })
  content: string
}

@Command({
  name: 'ping',
  description: 'Pong!',
})
@UsePipes(TransformPipe)
@Injectable()
export class PingCommand implements DiscordTransformedCommand<PingDTO> {
  private readonly logger = new Logger(PingCommand.name)

  handler(@Payload() dto: PingDTO): InteractionReplyOptions {
    this.logger.log(`Performing 'ping' command... with ${JSON.stringify(dto)}`)
    return {
      content: 'Pong!' + (dto.content ? ` ${dto.content}` : ''),
      ephemeral: true,
    }
  }
}
