import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueProducerService } from '../quue/service';
import { EnvironmentVariable } from '~/types/enums';

@Injectable()
export class ClickBufferService implements OnModuleInit {
  private readonly logger = new Logger(ClickBufferService.name);
  private buffer: Map<string, number> = new Map();
  private maxBufferSize: number;
  private flushDelay: number;
  private lastFlushTime: number = Date.now();

  constructor(
    private queueProducer: QueueProducerService,
    private configService: ConfigService,
  ) {
    this.maxBufferSize = this.configService.get(
      EnvironmentVariable.Queue_max_buffer_size,
    );
    this.flushDelay = this.configService.get(
      EnvironmentVariable.Queue_flush_delay,
    );
  }

  async onModuleInit() {
    this.logger.log('ClickBufferService initialized');
  }

  async addClick(shortCode: string): Promise<void> {
    const current = this.buffer.get(shortCode) || 0;
    this.buffer.set(shortCode, current + 1);

    if (this.buffer.size >= this.maxBufferSize) {
      this.logger.warn(
        `Buffer size limit reached (${this.buffer.size}), forcing flush`,
      );
      await this.scheduleFlush('size-limit', 0);
    }
  }

  async scheduleFlush(
    trigger: 'size-limit' | 'time-based' | 'manual' = 'manual',
    delay?: number,
  ): Promise<void> {
    if (this.buffer.size === 0) {
      this.logger.debug('Buffer empty, skipping flush');
      return;
    }

    const snapshot = new Map(this.buffer);
    const totalClicks = Array.from(snapshot.values()).reduce(
      (sum, val) => sum + val,
      0,
    );

    this.logger.log(
      `Scheduling flush: ${snapshot.size} unique codes, ${totalClicks} total clicks (trigger: ${trigger})`,
    );

    await this.queueProducer.addFlushJob(
      {
        clicksMap: Array.from(snapshot.entries()),
        timestamp: new Date().toISOString(),
        trigger,
        totalClicks,
      },
      delay !== undefined ? delay : this.flushDelay,
    );

    this.buffer.clear();
    this.lastFlushTime = Date.now();
  }

  async flushAndGet(): Promise<Map<string, number>> {
    const snapshot = new Map(this.buffer);
    this.buffer.clear();
    return snapshot;
  }

  getBufferSize(): number {
    return this.buffer.size;
  }

  getStats() {
    return {
      bufferSize: this.buffer.size,
      lastFlushTime: this.lastFlushTime,
      maxBufferSize: this.maxBufferSize,
    };
  }
}
