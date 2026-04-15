import { Module } from '@nestjs/common';
import { UrlService } from './service';
import { UrlController } from './controller';
import { UrlEntity } from './entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '../cache/module';
import { ClickBufferModule } from '../click-buffer/module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UrlEntity]),
    CacheModule,
    ClickBufferModule,
  ],
  controllers: [UrlController],
  providers: [UrlService],
  exports: [UrlService],
})
export class UrlModule {}
