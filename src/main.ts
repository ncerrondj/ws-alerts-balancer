import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  setInterval(() => {
      const used = process.memoryUsage();
      console.log('RAM MB:', used.heapUsed / 1024 / 1024);
  }, 2000);
  const app = await NestFactory.create(AppModule);
  
  app.enableCors();
  await app.listen(process.env.PORT ?? 5001);
}
bootstrap();
