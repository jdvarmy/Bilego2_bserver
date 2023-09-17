import { Module } from '@nestjs/common';
import { EventsController } from './controllers/events.controller';
import { EventsService } from './services/events.service';
import { DatabaseModule } from '../../database/database.module';
import { MapModule } from '../map/map.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { ItemsModule } from '../items/items.module';
import { ArtistsModule } from '../artists/artists.module';
import { UsersModule } from '../users/users.module';
import { EventDatesController } from './controllers/eventDates.controller';
import { EventDatesService } from './services/eventDates.service';
import { EventsUtilsService } from './services/events.utils.service';
import { EventsClientController } from './controllers/events-client.controller';

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
  controllers: [EventsController, EventDatesController, EventsClientController],
  providers: [EventsService, EventDatesService, EventsUtilsService],
  exports: [EventsService, EventDatesService, EventsUtilsService],
})
export class EventsModule {}
