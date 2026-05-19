import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/module';
import { ClickBufferService } from './service';
import { QueueModule } from '../quue/module';

@Module({
  imports: [CacheModule, QueueModule],
  providers: [ClickBufferService],
  exports: [ClickBufferService],
})
export class ClickBufferModule {}
