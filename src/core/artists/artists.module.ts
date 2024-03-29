import { Module } from '@nestjs/common';
import { ArtistsService } from './services/artists.service';
import { ArtistsController } from './artists.controller';
import { DatabaseModule } from '../../database/database.module';
import { ArtistsUtilsService } from './services/artists.utils.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, ArtistsUtilsService],
  exports: [ArtistsService, ArtistsUtilsService],
})
export class ArtistsModule {}
