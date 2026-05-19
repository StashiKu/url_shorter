import { EnvironmentVariable } from '../../types/enums';
import { IConfigValidationSchema } from './types';
import * as Joi from 'joi';

const CACHE_DEFAULT_TTL = 10000;
const CACHE_DEFAULT_PORT = 6379;
const QUEUE_DEFAULT_FLUSH_DELAY = 1000;
const CACHE_DEFAULT_HOST = 'localhost';
const QUEUE_DEFAULT_MAX_BUFFER_SIZE = 1000;

export const VALIDATION_SCHEMA = Joi.object<IConfigValidationSchema>({
  [EnvironmentVariable.Db_host]: Joi.string().required(),
  [EnvironmentVariable.Db_port]: Joi.number().required(),
  [EnvironmentVariable.Db_name]: Joi.string().required(),
  [EnvironmentVariable.Db_username]: Joi.string().required(),
  [EnvironmentVariable.Db_pool_size]: Joi.number().required(),
  [EnvironmentVariable.Queue_name]: Joi.string().required(),
  [EnvironmentVariable.Cache_ttl]: Joi.number().default(CACHE_DEFAULT_TTL),
  [EnvironmentVariable.Cache_host]: Joi.string().default(CACHE_DEFAULT_HOST),
  [EnvironmentVariable.Cache_port]: Joi.number().default(CACHE_DEFAULT_PORT),
  [EnvironmentVariable.Queue_max_buffer_size]: Joi.number().default(
    QUEUE_DEFAULT_MAX_BUFFER_SIZE,
  ),
  [EnvironmentVariable.Queue_flush_delay]: Joi.number().default(
    QUEUE_DEFAULT_FLUSH_DELAY,
  ),
});
