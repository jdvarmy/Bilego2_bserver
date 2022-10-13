import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
  STATIC_FILES_DIR,
} from './constants/env';
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
import { ErrorsInterceptor } from './errors/errors.interceptor';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './database/database.module';
import { MedialibraryModule } from './medialibrary/medialibrary.module';
import { MapModule } from './map/map.module';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
      synchronize: true, // todo: убрать на проде
    }),
    ApiModule,
    DatabaseModule,
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
    {
      provide: APP_INTERCEPTOR,
      useClass: ErrorsInterceptor,
    },
  ],
})
export class AppModule {}
