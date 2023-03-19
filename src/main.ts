import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { CLIENT_URL, ADMIN_URL, PORT } from './types/constants/env';
import { NestExpressApplication } from '@nestjs/platform-express';
import passport from 'passport';

const whitelist = [CLIENT_URL, ADMIN_URL];

async function bootstrap() {
  try {
    const port = PORT || 3000;
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.enableCors({ credentials: true, origin: whitelist });

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    // app.use(passport.initialize());
    // app.use(passport.session());

    await app.listen(port, async () => {
      console.log(`Server start on port ${await app.getUrl()}`);
    });
  } catch (e) {
    console.log('Server error', e);
  }
}

bootstrap();
