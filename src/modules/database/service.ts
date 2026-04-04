import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onModuleDestroy() {
    console.log('Closing database connection...');
    await this.dataSource.destroy();
    console.log('Database connection closed.');
  }
}
