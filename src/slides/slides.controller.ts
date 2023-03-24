import { Controller, Get, Query } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { City, Routs } from '../utils/types/enums';

@Controller(Routs.slides)
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  getSlides(@Query('c') city?: City) {
    return this.slidesService.getSlides(city);
  }
}
