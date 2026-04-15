import { Module } from '@nestjs/common';
import { CacheModule } from '../cache/module';
import { ClickBufferService } from './service';

@Module({
  imports: [CacheModule],
  providers: [ClickBufferService],
  exports: [ClickBufferService],
})
export class ClickBufferModule {}
