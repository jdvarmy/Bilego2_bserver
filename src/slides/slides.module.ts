import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';

@Module({
  imports: [ApiModule],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
