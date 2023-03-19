import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryController } from './medialibrary.controller';
import { MedialibraryService } from './services/medialibrary.service';
import { FileModule } from '../file/file.module';
import { MedialibraryUtilsService } from './services/medialibrary.utils.service';

@Module({
  imports: [DatabaseModule, FileModule],
  controllers: [MedialibraryController],
  providers: [MedialibraryService, MedialibraryUtilsService],
  exports: [MedialibraryService, MedialibraryUtilsService],
})
export class MedialibraryModule {}
