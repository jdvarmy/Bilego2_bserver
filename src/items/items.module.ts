import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DatabaseModule } from '../database/database.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';

@Module({
  imports: [DatabaseModule, TaxonomyModule, MedialibraryModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
