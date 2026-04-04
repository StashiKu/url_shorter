import { EnvironmentVariable } from '../../types/enums';

export type IConfigValidationSchema = {
  [EnvironmentVariable.Db_host]?: string;
  [EnvironmentVariable.Db_port]?: number;
  [EnvironmentVariable.Db_name]?: string;
  [EnvironmentVariable.Db_username]?: string;
  [EnvironmentVariable.Db_password]?: string;
  [EnvironmentVariable.Db_pool_size]?: number;
};
