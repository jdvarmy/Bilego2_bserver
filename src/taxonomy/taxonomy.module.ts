import { Module } from '@nestjs/common';
import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './services/taxonomy.service';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { TaxonomyUtilsService } from './services/taxonomy.utils.service';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [DatabaseModule, MedialibraryModule, DataLoggerModule],
  controllers: [TaxonomyController],
  providers: [TaxonomyService, TaxonomyUtilsService],
  exports: [TaxonomyService, TaxonomyUtilsService],
})
export class TaxonomyModule {}
