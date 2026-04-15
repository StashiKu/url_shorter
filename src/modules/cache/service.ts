import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  public readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get('CACHE_HOST'),
      port: this.configService.get('CACHE_PORT'),
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
  }

  async get<T>(key: string): Promise<T | null> {
    const res = await this.client.get(key);

    return JSON.parse(res);
  }

  async set(key: string, value: any, ttl = 5000): Promise<void> {
    await this.client.setex(key, ttl, JSON.stringify(value));
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async incrementHash(
    key: string,
    field: string,
    increment = 1,
  ): Promise<number> {
    return this.client.hincrby(key, field, increment);
  }

  async getHashAll(key: string): Promise<Record<string, string>> {
    return this.client.hgetall(key);
  }

  async delHash(key: string): Promise<number> {
    return this.client.del(key);
  }

  async flushHash(key: string): Promise<Record<string, string>> {
    const multi = this.client.multi();
    multi.hgetall(key);
    multi.del(key);

    const results = await multi.exec();

    return (results?.[0]?.[1] as Record<string, string>) || {};
  }
}
