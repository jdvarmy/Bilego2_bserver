import { Module } from '@nestjs/common';
import { ItemsService } from './services/items.service';
import { ItemsController } from './items.controller';
import { DatabaseModule } from '../database/database.module';
import { TaxonomyModule } from '../taxonomy/taxonomy.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { ItemsUtilsService } from './services/items.utils.service';

@Module({
  imports: [DatabaseModule, TaxonomyModule, MedialibraryModule],
  controllers: [ItemsController],
  providers: [ItemsService, ItemsUtilsService],
  exports: [ItemsService, ItemsUtilsService],
})
export class ItemsModule {}
