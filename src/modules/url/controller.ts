import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Redirect,
} from '@nestjs/common';
import {
  CreateShortUrlRequestDTO,
  CreateShortUrlResponseDTO,
  UpdateUrlRequestDTO,
} from './dto';
import { UrlService } from './service';

@Controller('shorten')
export class UrlController {
  constructor(private readonly url: UrlService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async create(
    @Body() body: CreateShortUrlRequestDTO,
  ): Promise<CreateShortUrlResponseDTO> {
    const result = this.url.create(body);

    return result;
  }

  @Get(':shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const url = await this.url.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    this.url.incrementClicks(shortCode).catch(console.error);

    return { url: url.originalUrl, statusCode: 302 };
  }

  @Get('urls/:shortCode')
  async findOne(@Param('shortCode') shortCode: string) {
    const url = await this.url.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  @Get('urls/:shortCode/stats')
  async getStats(@Param('shortCode') shortCode: string) {
    return this.url.getStats(shortCode);
  }

  @Patch('urls/:shortCode')
  async update(
    @Param('shortCode') shortCode: string,
    @Body() updateUrlDto: UpdateUrlRequestDTO,
  ) {
    return this.url.update(shortCode, updateUrlDto);
  }

  @Delete('urls/:shortCode')
  async remove(@Param('shortCode') shortCode: string) {
    await this.url.remove(shortCode);

    return { message: 'URL successfully deleted' };
  }

  @Get('urls')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.url.findAll({ page, limit, sortBy, order });
  }
}
