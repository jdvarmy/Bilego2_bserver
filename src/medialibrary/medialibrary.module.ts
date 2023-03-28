import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryController } from './medialibrary.controller';
import { MedialibraryService } from './services/medialibrary.service';
import { FileModule } from '../file/file.module';
import { MedialibraryUtilsService } from './services/medialibrary.utils.service';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [DatabaseModule, FileModule, DataLoggerModule],
  controllers: [MedialibraryController],
  providers: [MedialibraryService, MedialibraryUtilsService],
  exports: [MedialibraryService, MedialibraryUtilsService],
})
export class MedialibraryModule {}
