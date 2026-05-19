import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariable } from '~/types/enums';

@Injectable()
export class QueueProducerService implements OnModuleInit {
  private readonly logger = new Logger(QueueProducerService.name);
  private isReady = false;
  private queueName: string;

  constructor(
    @InjectQueue('flush') private queue: Queue,
    private configService: ConfigService,
  ) {
    this.queueName = this.configService.get(EnvironmentVariable.Queue_name);
  }

  async onModuleInit() {
    await this.waitForQueue();
    this.isReady = true;
    this.logger.log(`Queue "${this.queueName}" is ready`);
  }

  private async waitForQueue(maxAttempts = 30): Promise<void> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (this.queue && (await this.queue.client)) {
          this.logger.log(`Queue connected (attempt ${attempt})`);
          return;
        }
      } catch (error) {
        this.logger.debug(`Waiting for queue... (${attempt}/${maxAttempts})`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    throw new Error(`Failed to connect to queue "${this.queueName}"`);
  }

  async addFlushJob(data: any, delay?: number): Promise<string> {
    if (!this.isReady) {
      this.logger.warn('Queue not ready, job not scheduled');
      return null;
    }

    try {
      const job = await this.queue.add('flush', data, {
        delay: delay || 5000,
        jobId: `flush-${Date.now()}-${Math.random()}`,
      });

      this.logger.debug(`Job ${job.id} scheduled`);
      return job.id;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(`Failed to add job: ${error.message}`);
      }

      throw error;
    }
  }

  async getQueueStats() {
    if (!this.isReady) return null;

    return {
      waiting: await this.queue.getWaitingCount(),
      active: await this.queue.getActiveCount(),
      completed: await this.queue.getCompletedCount(),
      failed: await this.queue.getFailedCount(),
      delayed: await this.queue.getDelayedCount(),
    };
  }
}
