import { ScheduleModule } from '@nestjs/schedule';
import { Module } from '@nestjs/common';

import { AppController } from './controller';
import { AppService } from './service';

import { UrlModule } from '../url/module';
import { CONFIG_MODULE } from '../config';
import { DatabaseModule } from '../database';
import { CacheModule } from '../cache/module';
import { HealthCheckModule } from '../health/module';
import { ClickBufferModule } from '../click-buffer/module';
import { FlushClicksModule } from '../flush-clicks/module';
import { QueueModule } from '../quue/module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HealthCheckModule,
    ClickBufferModule,
    FlushClicksModule,
    DatabaseModule,
    CONFIG_MODULE,
    CacheModule,
    QueueModule,
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
