import { EnvironmentVariable } from '../../types/enums';

export type IConfigValidationSchema = {
  [EnvironmentVariable.Db_host]?: string;
  [EnvironmentVariable.Db_port]?: number;
  [EnvironmentVariable.Db_name]?: string;
  [EnvironmentVariable.Db_username]?: string;
  [EnvironmentVariable.Db_password]?: string;
  [EnvironmentVariable.Db_pool_size]?: number;
  [EnvironmentVariable.Cache_host]: string;
  [EnvironmentVariable.Cache_port]: number;
  [EnvironmentVariable.Cache_ttl]: number;
  [EnvironmentVariable.Queue_name]: string;
  [EnvironmentVariable.Queue_max_buffer_size]: number;
  [EnvironmentVariable.Queue_flush_delay]: number;
};
