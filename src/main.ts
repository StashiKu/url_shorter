import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app
    .use(helmet())
    .useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: false,
        stopAtFirstError: true,
        transform: true,
      }),
    )
    .enableCors();

  await app.listen(3000);
}
bootstrap();

// check how to implement graceful shutdown in nest
// implement db module
