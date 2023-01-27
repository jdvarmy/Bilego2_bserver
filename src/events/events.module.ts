import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { DatabaseModule } from '../database/database.module';
import { MapModule } from '../map/map.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { ItemsModule } from '../items/items.module';
import { ArtistsModule } from '../artists/artists.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    DatabaseModule,
    MapModule,
    TaxonomyModule,
    MedialibraryModule,
    ItemsModule,
    ArtistsModule,
    UsersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
