import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { MedialibraryModule } from '../medialibrary/medialibrary.module';
import { SliderController } from './slider.controller';
import { SliderService } from './slider.service';

@Module({
  imports: [DatabaseModule, MedialibraryModule],
  controllers: [SliderController],
  providers: [SliderService],
  exports: [],
})
export class SliderModule {}
