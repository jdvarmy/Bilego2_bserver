import { Module } from '@nestjs/common';
import { TaxonomyController } from './taxonomy.controller';
import { TaxonomyService } from './taxonomy.service';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';

@Module({
  imports: [DatabaseModule, MedialibraryModule],
  controllers: [TaxonomyController],
  providers: [TaxonomyService],
  exports: [TaxonomyService],
})
export class TaxonomyModule {}
