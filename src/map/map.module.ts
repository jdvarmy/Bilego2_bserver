import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { FileModule } from '../file/file.module';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';

@Module({
  imports: [DatabaseModule, FileModule, MedialibraryModule],
  controllers: [MapController],
  providers: [MapService],
  exports: [MapService],
})
export class MapModule {}
