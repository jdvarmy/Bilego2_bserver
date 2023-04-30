import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
  STATIC_FILES_DIR,
  CLOUD_S3_ACCESS,
  CLOUD_S3_SECRET,
  CLOUD_S3_ENDPOINT,
  NODE_ENV,
} from './utils/types/constants/env';
import entities from './typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { ApiModule } from './api/api.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ItemsModule } from './items/items.module';
import { ArtistsModule } from './artists/artists.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { SlidesModule } from './slides/slides.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { ErrorInterceptor } from './utils/interceptors/error.interceptor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { MedialibraryModule } from './medialibrary/medialibrary.module';
import { MapModule } from './map/map.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PassportModule } from '@nestjs/passport';
import { AllExceptionsFilter } from './utils/filters/all-exceptions.filter';
import { DataLoggerModule } from './logger/data.logger.module';
import { HttpsRedirectMiddleware } from './utils/middleware/https.redirect.middleware';
import { S3Module } from 'nestjs-s3';

let envFilePath = '.env';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
if (NODE_ENV === 'production') envFilePath = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, STATIC_FILES_DIR),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: MYSQL_HOST,
      port: MYSQL_PORT,
      database: MYSQL_DB,
      username: MYSQL_USER,
      password: MYSQL_PASS,
      entities: entities,
      synchronize: NODE_ENV === 'development', // todo: убрать на проде
    }),
    S3Module.forRoot({
      config: {
        accessKeyId: CLOUD_S3_ACCESS,
        secretAccessKey: CLOUD_S3_SECRET,
        endpoint: CLOUD_S3_ENDPOINT,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
      },
    }),
    PassportModule.register({ session: true }),
    MulterModule.register({ storage: memoryStorage() }),
    ApiModule,
    DatabaseModule,
    DataLoggerModule,
    AuthModule,
    UsersModule,
    EventsModule,
    ArtistsModule,
    ItemsModule,
    TicketsModule,
    SlidesModule,
    TaxonomyModule,
    MedialibraryModule,
    MapModule,
    FileModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: ErrorInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
