import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { FileModule } from '../../file/file.module';
import { MapController } from './map.controller';
import { MapService } from './services/map.service';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { MapUtilsService } from './services/map.utils.service';

@Module({
  imports: [DatabaseModule, FileModule, MedialibraryModule],
  controllers: [MapController],
  providers: [MapService, MapUtilsService],
  exports: [MapService, MapUtilsService],
})
export class MapModule {}
