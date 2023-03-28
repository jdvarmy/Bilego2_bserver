import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { MapController } from './map.controller';
import { MapService } from './services/map.service';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { MapUtilsService } from './services/map.utils.service';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [DatabaseModule, FileModule, MedialibraryModule, DataLoggerModule],
  controllers: [MapController],
  providers: [MapService, MapUtilsService],
  exports: [MapService, MapUtilsService],
})
export class MapModule {}
