import { Module } from '@nestjs/common';
import { HealthCheckController } from './controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [TerminusModule],
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
