import { ConfigModule } from '@nestjs/config';
import { VALIDATION_SCHEMA } from './constants';

export const CONFIG_MODULE = ConfigModule.forRoot({
  validationSchema: VALIDATION_SCHEMA,
  isGlobal: true,
  cache: true,
});
