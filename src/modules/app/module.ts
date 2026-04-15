import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { HealthCheckModule } from '../health/module';
import { DatabaseModule } from '../database';
import { CONFIG_MODULE } from '../config';
import { CacheModule } from '../cache/module';
import { UrlModule } from '../url/module';
import { ClickBufferModule } from '../click-buffer/module';
import { FlushClicksWorker } from '../../workers/flush-clicks.worker';

@Module({
  imports: [
    HealthCheckModule,
    ClickBufferModule,
    ScheduleModule.forRoot(),
    DatabaseModule,
    CONFIG_MODULE,
    CacheModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService, FlushClicksWorker],
})
export class AppModule {}
