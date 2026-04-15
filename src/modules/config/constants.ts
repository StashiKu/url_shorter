import { EnvironmentVariable } from '../../types/enums';
import { IConfigValidationSchema } from './types';
import * as Joi from 'joi';

export const VALIDATION_SCHEMA = Joi.object<IConfigValidationSchema>({
  [EnvironmentVariable.Db_host]: Joi.string().required(),
  [EnvironmentVariable.Db_port]: Joi.number().required(),
  [EnvironmentVariable.Db_name]: Joi.string().required(),
  [EnvironmentVariable.Db_username]: Joi.string().required(),
  [EnvironmentVariable.Db_pool_size]: Joi.number().required(),
  [EnvironmentVariable.Cache_host]: Joi.string().required(),
  [EnvironmentVariable.Cache_port]: Joi.number().required(),
});
