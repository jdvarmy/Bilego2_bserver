import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { SliderClientController } from './controllers/slider-client.controller';
import { SliderService } from './services/slider.service';

@Module({
  imports: [DatabaseModule, MedialibraryModule],
  controllers: [SliderClientController],
  providers: [SliderService],
  exports: [],
})
export class SliderModule {}
