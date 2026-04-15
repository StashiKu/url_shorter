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
import { ClickBufferService } from '../click-buffer/service';

@Controller('shorten')
export class UrlController {
  constructor(
    private readonly url: UrlService,
    private readonly click_buffer: ClickBufferService,
  ) {}

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

    await this.click_buffer.addClick(shortCode);

    return { url: url.originalUrl, statusCode: 302 };
  }

  @Get('url/:shortCode')
  async findOne(@Param('shortCode') shortCode: string) {
    const url = await this.url.findByShortCode(shortCode);

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  @Get('url/:shortCode/stats')
  async getStats(@Param('shortCode') shortCode: string) {
    return this.url.getStats(shortCode);
  }

  @Patch('url/:shortCode')
  async update(
    @Param('shortCode') shortCode: string,
    @Body() updateUrlDto: UpdateUrlRequestDTO,
  ) {
    return this.url.update(shortCode, updateUrlDto);
  }

  @Delete('url/:shortCode')
  async remove(@Param('shortCode') shortCode: string) {
    await this.url.remove(shortCode);

    return { message: 'URL successfully deleted' };
  }

  @Get('url')
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
  ) {
    return this.url.findAll({ page, limit, sortBy, order });
  }
}
