import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { FlushSchedulerService } from './service';
import { FlushClicksWorker } from '../../workers/flush-clicks.worker';
import { ClickBufferModule } from '../click-buffer/module';
import { UrlModule } from '../url';

@Module({
  imports: [
    ClickBufferModule,
    UrlModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'flush',
    }),
  ],
  providers: [FlushSchedulerService, FlushClicksWorker],
  exports: [FlushSchedulerService],
})
export class FlushClicksModule {}
