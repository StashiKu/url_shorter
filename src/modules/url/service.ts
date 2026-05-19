import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UrlEntity } from './entity';
import {
  IShortUrl,
  FindAllParams,
  IUpdateUrlRequest,
  ICreateShortUrlRequest,
} from './types';
import { CacheService } from '../cache/service';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(UrlEntity)
    private readonly repository: Repository<UrlEntity>,
    private readonly cache: CacheService,
    private readonly dataSource: DataSource,
  ) {}

  convert(record: UrlEntity): IShortUrl {
    return {
      ...record,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt?.toISOString(),
    };
  }

  async create(body: ICreateShortUrlRequest): Promise<IShortUrl> {
    const { originalUrl, customAlias } = body;

    if (!this.isValidUrl(originalUrl)) {
      throw new BadRequestException('Invalid URL format');
    }

    if (customAlias) {
      const existingUrl = await this.repository.findOne({
        where: { shortCode: customAlias },
      });

      if (existingUrl) {
        throw new ConflictException('Custom alias already exists');
      }
    }

    const shortCode = customAlias || (await this.generateUniqueShortCode());
    const url = this.repository.create({
      originalUrl,
      shortCode,
      clicks: 0,
    });
    const savedUrl = await this.repository.save(url);
    const result = {
      ...this.convert(savedUrl),
      shortUrl: this.shortenUrl(savedUrl.shortCode),
    };

    await this.cache.set(shortCode, result);

    return result;
  }

  shortenUrl(shortCode: string): string {
    return `${process.env.BASE_URL || 'http://localhost:3000'}/${shortCode}`;
  }

  async update(
    shortCode: string,
    updateUrlDto: IUpdateUrlRequest,
  ): Promise<UrlEntity> {
    const url = await this.findOne(shortCode);

    if (updateUrlDto.originalUrl) {
      if (!this.isValidUrl(updateUrlDto.originalUrl)) {
        throw new BadRequestException('Invalid URL format');
      }

      url.originalUrl = this.normalizeUrl(updateUrlDto.originalUrl);
    }

    if (updateUrlDto.shortCode) {
      const existingUrl = await this.findByShortCode(updateUrlDto.shortCode);
      if (existingUrl && existingUrl.id !== url.id) {
        throw new ConflictException(
          `Short code "${updateUrlDto.shortCode}" already exists`,
        );
      }

      if (!this.isValidAlias(updateUrlDto.shortCode)) {
        throw new BadRequestException(
          'Short code can only contain letters, numbers, and underscores, and must be 3-20 characters long',
        );
      }

      url.shortCode = updateUrlDto.shortCode;
    }

    url.updatedAt = new Date();

    return this.repository.save(url);
  }

  async remove(shortCode: string): Promise<void> {
    const url = await this.findOne(shortCode);
    await this.repository.remove(url);
  }

  async findAll(params: FindAllParams): Promise<{
    data: UrlEntity[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  }> {
    const { page, limit, sortBy, order } = params;
    const skip = (page - 1) * limit;
    const allowedSortFields = [
      'createdAt',
      'clicks',
      'updatedAt',
      'originalUrl',
    ];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';

    const [data, total] = await this.repository.findAndCount({
      skip,
      take: limit,
      order: { [sortField]: order },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByShortCode(shortCode: string): Promise<UrlEntity | null> {
    let url = await this.cache.get<UrlEntity>(shortCode);

    if (!url) {
      url = await this.repository.findOne({
        where: { shortCode },
      });

      await this.cache.set(shortCode, url);
    }

    return url;
  }

  async findOne(shortCode: string): Promise<UrlEntity> {
    const url = await this.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException(
        `URL with short code "${shortCode}" not found`,
      );
    }

    if (typeof url === 'string') {
      return JSON.parse(url);
    }

    return url;
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const { originalUrl } = await this.findByShortCode(shortCode);

    return originalUrl;
  }

  async getStats(shortCode: string): Promise<any> {
    const url = await this.findOne(shortCode);
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return {
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      totalClicks: url.clicks,
      createdAt: url.createdAt,
      lastClickAt: url.lastClickAt,
    };
  }

  private normalizeUrl(url: string): string {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return 'https://' + url;
    }
    return url;
  }

  private async generateUniqueShortCode(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const codeLength = 6;
    let isUnique = false;
    let shortCode = '';

    while (!isUnique) {
      shortCode = '';
      for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        shortCode += characters[randomIndex];
      }

      const existingUrl = await this.repository.findOne({
        where: { shortCode },
      });

      if (!existingUrl) {
        isUnique = true;
      }
    }

    return shortCode;
  }

  async bulkIncrementClicks(clicksMap: Map<string, number>): Promise<void> {
    if (clicksMap.size === 0) return;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      for (const [shortCode, increment] of clicksMap) {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(UrlEntity)
          .set({ clicks: () => `clicks + ${increment}` })
          .where('shortCode = :shortCode', { shortCode })
          .execute();
      }
    });
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private isValidAlias(alias: string): boolean {
    const aliasRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return aliasRegex.test(alias);
  }
}
