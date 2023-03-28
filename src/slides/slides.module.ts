import { Module } from '@nestjs/common';
import { ApiModule } from '../api/api.module';
import { SlidesController } from './slides.controller';
import { SlidesService } from './slides.service';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [ApiModule, DataLoggerModule],
  controllers: [SlidesController],
  providers: [SlidesService],
})
export class SlidesModule {}
