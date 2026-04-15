import { Injectable } from '@nestjs/common';
import { CacheService } from '../cache/service';

@Injectable()
export class ClickBufferService {
  bufferKey = 'clicks';

  constructor(private cache: CacheService) {}

  async addClick(shortCode: string): Promise<void> {
    await this.cache.incrementHash(this.bufferKey, shortCode, 1);
  }

  async flushAndGet(): Promise<Map<string, number>> {
    const pendingClicks = await this.cache.flushHash(this.bufferKey);
    const clicksMap = new Map<string, number>();

    for (const [shortCode, count] of Object.entries(pendingClicks)) {
      clicksMap.set(shortCode, parseInt(count, 10));
    }

    return clicksMap;
  }
}
