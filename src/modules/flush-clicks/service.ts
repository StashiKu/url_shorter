import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';

@Injectable()
export class FlushSchedulerService {
  private readonly logger = new Logger(FlushSchedulerService.name);

  constructor(@InjectQueue('flush') private readonly flushQueue: Queue) {}

  @Cron('*/10 * * * * *')
  async scheduleRegularFlush() {
    const activeJobs = await this.flushQueue.getActiveCount();
    const waitingJobs = await this.flushQueue.getWaitingCount();

    if (activeJobs === 0 && waitingJobs === 0) {
      await this.flushQueue.add(
        'flush',
        {
          scheduledAt: new Date().toISOString(),
          triggeredBy: 'cron',
        },
        {
          delay: 0,
        },
      );
      this.logger.log('Scheduled regular flush job');
    } else {
      this.logger.log(
        `Flush already in progress (active: ${activeJobs}, waiting: ${waitingJobs})`,
      );
    }
  }
}
