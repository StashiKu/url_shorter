export type ICreateShortUrlRequest = {
  originalUrl: string;
  customAlias?: string;
  expiresAt?: string;
};

export type IUpdateUrlRequest = {
  originalUrl?: string;
  shortCode?: string;
};

export type FindAllParams = {
  page: number;
  limit: number;
  sortBy: string;
  order: 'ASC' | 'DESC';
};

export type IShortUrl = {
  id: number;
  clicks: number;
  shortCode: string;
  updatedAt: string;
  createdAt: string;
  originalUrl: string;
  shortUrl?: string;
};
