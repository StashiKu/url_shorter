import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { EnvironmentVariable } from '~/types/enums';
import { DatabaseService } from './service';

export const DATABASE_MODULE = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>(EnvironmentVariable.Db_host),
    port: config.get<number>(EnvironmentVariable.Db_port),
    username: config.get<string>(EnvironmentVariable.Db_username),
    password: config.get<string>(EnvironmentVariable.Db_password),
    database: config.get<string>(EnvironmentVariable.Db_name),
    logging: ['query', 'error', 'warn', 'migration'],
    retryAttempts: 6,
    retryDelay: 5000,
    entities: [
      join(__dirname + '../../../**/entity{.ts,.js}'),
      join(__dirname + '../../../migrations/mutations/**/entities/*{.ts,.js}'),
    ],
    migrations: [join(__dirname + '../../../migrations/run/*{.ts,.js}')],
    migrationsTableName: 'migrations',
    migrationsRun: true,
    synchronize: false,
    autoLoadEntities: false,
    manualInitialization: false,
    connectTimeoutMS: 10000,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 2000,
    poolSize: config.get<number>(EnvironmentVariable.Db_pool_size),
    cache: {
      type: 'ioredis',
      options: {
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
      },
    },
  }),
});

@Module({
  imports: [ConfigModule, DATABASE_MODULE],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  constructor() {
    console.log(join(__dirname + '../../../migrations/run'));
  }
}
