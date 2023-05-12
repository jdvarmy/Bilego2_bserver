import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CLIENT_URL, ADMIN_URL, PORT } from './utils/types/constants/env';
import { NestExpressApplication } from '@nestjs/platform-express';

export const mainDir = __dirname;

const whitelist = [CLIENT_URL, ADMIN_URL];

async function bootstrap() {
  try {
    const port = PORT || 3000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.enableCors({
      credentials: true,
      origin: whitelist,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
    });

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.listen(port, async () => {
      console.log(`Server start on port ${await app.getUrl()}`);
    });
  } catch (e) {
    console.log('Server error', e);
  }
}

bootstrap();
