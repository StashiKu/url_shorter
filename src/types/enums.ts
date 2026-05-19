// @cspell:ignore edms_entity

export enum EnvironmentVariable {
  Db_password = 'DB_PASSWORD',
  Db_port = 'DB_PORT',
  Db_username = 'DB_USER_NAME',
  Db_name = 'DB_NAME',
  Db_host = 'DB_HOST',
  Db_pool_size = 'DB_POOL_SIZE',
  Cache_host = 'CACHE_HOST',
  Cache_port = 'CACHE_PORT',
  Cache_ttl = 'CACHE_TTL',
  Queue_name = 'QUEUE_NAME',
  Queue_flush_delay = 'QUEUE_FLUSH_DELAY',
  Queue_max_buffer_size = 'QUEUE_MAX_BUFFER_SIZE',
}
