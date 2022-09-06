import { Module } from '@nestjs/common'

import { EpicService } from './epic.service'

@Module({
  providers: [EpicService],
})
export class EpicModule {}
