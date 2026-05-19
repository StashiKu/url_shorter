import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { UrlService } from '~/modules/url';
import { ClickBufferService } from '~/modules/click-buffer/service';
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';

@Processor('flush', {
  concurrency: 1,
  limiter: {
    max: 1,
    duration: 1000,
  },
})
export class FlushClicksWorker extends WorkerHost {
  private readonly logger = new Logger(FlushClicksWorker.name);
  private readonly BATCH_SIZE = 1000;

  constructor(
    private readonly click_buffer: ClickBufferService,
    private readonly url: UrlService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing flush job ${job.id}`);

    const clicksMap = await this.click_buffer.flushAndGet();

    if (clicksMap.size === 0) {
      this.logger.log('No clicks to flush');
      return { processed: 0 };
    }

    this.logger.log(`Flushing ${clicksMap.size} unique short codes`);

    const entries = Array.from(clicksMap.entries());

    for (let i = 0; i < entries.length; i += this.BATCH_SIZE) {
      const batch = entries.slice(i, i + this.BATCH_SIZE);
      const batchMap = new Map(batch);

      await this.url.bulkIncrementClicks(batchMap);

      const batchTotal = Array.from(batchMap.values()).reduce(
        (sum, val) => sum + val,
        0,
      );

      this.logger.log(
        `Processed batch ${i / this.BATCH_SIZE + 1}: ${batchTotal} clicks`,
      );
    }

    const totalClicks = Array.from(clicksMap.values()).reduce(
      (sum, val) => sum + val,
      0,
    );

    this.logger.log(`Successfully flushed ${totalClicks} clicks`);

    return {
      processed: totalClicks,
      uniqueCodes: clicksMap.size,
    };
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    this.logger.log(`Job ${job.id} is now active`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job, result: any) {
    this.logger.log(
      `Job ${job.id} completed: ${result.processed} clicks flushed`,
    );
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, error: Error) {
    this.logger.error(`Job ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnWorkerEvent('error')
  onError(error: Error) {
    this.logger.error(`Worker error: ${error.message}`, error.stack);
  }
}
