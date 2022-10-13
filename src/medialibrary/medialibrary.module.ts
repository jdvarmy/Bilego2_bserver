import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryController } from './medialibrary.controller';
import { MedialibraryService } from './medialibrary.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [DatabaseModule, FileModule],
  controllers: [MedialibraryController],
  providers: [MedialibraryService],
  exports: [MedialibraryService],
})
export class MedialibraryModule {}
