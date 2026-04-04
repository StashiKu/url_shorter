import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateShortUrlRequestDTO {
  @IsString()
  originalUrl: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  customAlias?: string;
}

export class CreateShortUrlResponseDTO {
  @IsNumber()
  id: number;

  @IsString()
  shortCode: string;

  @IsString()
  originalUrl: string;

  @IsNumber()
  clicks: number;

  @IsDateString()
  updatedAt: string;

  @IsDateString()
  createdAt: string;
}

export class UpdateUrlRequestDTO {
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid URL' })
  @MaxLength(2048, { message: 'URL is too long' })
  originalUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Short code must be at most 20 characters' })
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message:
      'Short code can only contain letters, numbers, underscores, and hyphens',
  })
  shortCode?: string;
}
