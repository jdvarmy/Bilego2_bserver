import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ApiModule } from '../api/api.module';
import { DatabaseModule } from '../database/database.module';
import { MapModule } from '../map/map.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';

@Module({
  imports: [
    ApiModule,
    DatabaseModule,
    MapModule,
    TaxonomyModule,
    MedialibraryModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
