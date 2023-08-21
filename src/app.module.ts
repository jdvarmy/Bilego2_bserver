import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  STATIC_FILES_DIR,
  CLOUD_S3_ACCESS,
  CLOUD_S3_SECRET,
  CLOUD_S3_ENDPOINT,
  NODE_ENV,
} from './utils/types/constants/env';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { ItemsModule } from './items/items.module';
import { ArtistsModule } from './artists/artists.module';
import { TicketsModule } from './tickets/tickets.module';
import { UsersModule } from './users/users.module';
import { TaxonomyModule } from './taxonomy/taxonomy.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { MedialibraryModule } from './medialibrary/medialibrary.module';
import { MapModule } from './map/map.module';
import { FileModule } from './file/file.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PassportModule } from '@nestjs/passport';
import { HttpsRedirectMiddleware } from './utils/middleware/https.redirect.middleware';
import { S3Module } from 'nestjs-s3';
import { databaseConfig } from './database/database.config';
import { SliderModule } from './slider/slider.module';

let envFilePath = '.env';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
if (NODE_ENV === 'production') envFilePath = '.env';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, STATIC_FILES_DIR),
    }),
    TypeOrmModule.forRoot(databaseConfig),
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
    DatabaseModule,
    AuthModule,
    UsersModule,
    EventsModule,
    ArtistsModule,
    ItemsModule,
    TicketsModule,
    TaxonomyModule,
    MedialibraryModule,
    MapModule,
    FileModule,
    SliderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(HttpsRedirectMiddleware).forRoutes('*');
  }
}
