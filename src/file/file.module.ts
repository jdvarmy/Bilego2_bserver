import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FileUtilsService } from './services/file.utils.service';
import { FileS3Service } from './services/file.s3.service';

@Module({
  providers: [FileService, FileUtilsService, FileS3Service],
  exports: [FileService, FileUtilsService, FileS3Service],
})
export class FileModule {}
