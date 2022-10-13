import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as requestIp from 'request-ip';
import { ValidationPipe } from '@nestjs/common';
import { CLIENT_URL, ADMIN_URL, PORT } from './constants/env';

const whitelist = [CLIENT_URL, ADMIN_URL];

async function bootstrap() {
  try {
    const port = PORT || 3000;
    const app = await NestFactory.create(AppModule);
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    app.enableCors({
      credentials: true,
      origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
    });

    app.use(requestIp.mw());

    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.listen(port, async () => {
      console.log(`Server start on port ${await app.getUrl()}`);
    });
  } catch (e) {
    console.log('Server error', e);
  }
}

bootstrap();
