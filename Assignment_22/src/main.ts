import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
// import { ConfigService } from '@nestjs/config';
import { StandardSchemaValidationPipe, ValidationPipe } from '@nestjs/common';
import { AppError } from './common/exceptions/error.handle.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  app.useGlobalFilters(new AppError());


  // const config = app.get(ConfigService)
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
