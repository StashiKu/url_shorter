import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProducerService } from './service';
import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { EnvironmentVariable } from '~/types/enums';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          connection: {
            host: config.get<string>(EnvironmentVariable.Cache_host),
            port: config.get<number>(EnvironmentVariable.Cache_port),
          },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        };
      },
    }),
    BullModule.registerQueueAsync({
      name: 'flush',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const queueName = configService.get(EnvironmentVariable.Queue_name);
        return {
          name: queueName,
        };
      },
    }),
  ],
  providers: [QueueProducerService],
  exports: [QueueProducerService, BullModule],
})
export class QueueModule {}
