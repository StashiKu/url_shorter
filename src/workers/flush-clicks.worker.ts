import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClickBufferService } from '~/modules/click-buffer/service';
import { UrlService } from '~/modules/url';

@Injectable()
export class FlushClicksWorker {
  private readonly logger = new Logger(FlushClicksWorker.name);
  private isFlushing = false;

  constructor(
    private readonly click_buffer: ClickBufferService,
    private readonly url: UrlService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async flush() {
    this.logger.log('Cron job is runnning');

    if (this.isFlushing) {
      this.logger.warn('Prev flush still in progress...');

      return;
    }

    this.isFlushing = true;

    try {
      const clicksMap = await this.click_buffer.flushAndGet();

      if (clicksMap.size === 0) return;

      this.logger.log(`Flushing ${clicksMap.size} unique short codes`);

      await this.url.bulkIncrementClicks(clicksMap);

      const tatalClicks = Array.from(clicksMap.values()).reduce(
        (sum, val) => sum + val,
        0,
      );

      this.logger.log(`Successfully flushed ${tatalClicks} clicks`);
    } catch (error) {
      this.logger.error('Failed to flush clicks', error);
    } finally {
      this.isFlushing = false;
    }
  }
}
