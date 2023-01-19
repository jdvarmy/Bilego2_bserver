import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule {}
