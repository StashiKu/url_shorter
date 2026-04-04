export type CreateShortUrlRequest = {
  originalUrl: string;
  customAlias?: string;
};

export type CreateShortUrlResponse = {
  id: number;
  clicks: number;
  shortCode: string;
  updatedAt: string;
  createdAt: string;
  originalUrl: string;
  shortUrl?: string;
};

export interface FindAllParams {
  page: number;
  limit: number;
  sortBy: string;
  order: 'ASC' | 'DESC';
}
