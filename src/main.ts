import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { AppLogger } from './logger/logger.service';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const logger = app.get(AppLogger);
  app.useLogger(logger);
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
