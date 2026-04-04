import { Module } from '@nestjs/common';
import { AppController } from './controller';
import { AppService } from './service';
import { HealthCheckModule } from '../health/module';
import { DatabaseModule } from '../database';
import { CONFIG_MODULE } from '../config';

@Module({
  imports: [HealthCheckModule, DatabaseModule, CONFIG_MODULE],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
