import { Module } from '@nestjs/common';
import { DataLoggerService } from './data.logger.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [DataLoggerService],
  exports: [DataLoggerService],
})
export class DataLoggerModule {}