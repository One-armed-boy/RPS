import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 등록된 프로퍼티만 가져옴
      transform: true, // DTO에 명시된 각종 변환 로직 파이프 단에서 적용
    }),
  );
  await app.listen(process.env.PORT);
}
bootstrap();
