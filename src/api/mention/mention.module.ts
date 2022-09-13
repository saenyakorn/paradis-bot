import { Module } from '@nestjs/common'

import { MentionService } from './mention.service'

@Module({
  providers: [MentionService],
})
export class MentionModule {}
