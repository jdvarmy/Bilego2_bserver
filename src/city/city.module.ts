import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';

@Module({
  imports: [DatabaseModule, MedialibraryModule],
  controllers: [CityController],
  providers: [CityService],
  exports: [],
})
export class CityModule {}
