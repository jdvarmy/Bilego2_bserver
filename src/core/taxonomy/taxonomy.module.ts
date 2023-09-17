import { Module } from '@nestjs/common';
import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './services/taxonomy.service';
import { DatabaseModule } from '../../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { TaxonomyUtilsService } from './services/taxonomy.utils.service';

@Module({
  imports: [DatabaseModule, MedialibraryModule],
  controllers: [TaxonomyController],
  providers: [TaxonomyService, TaxonomyUtilsService],
  exports: [TaxonomyService, TaxonomyUtilsService],
})
export class TaxonomyModule {}
