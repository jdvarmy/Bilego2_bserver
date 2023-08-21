import { Controller, Get, Param, Query } from '@nestjs/common';
import { CityShort, Routs } from '../utils/types/enums';
import { PostOptions } from '../utils/types/types';
import { SliderService } from './slider.service';
import { SliderDto } from './dtos/slider.dto';

@Controller(Routs.slider)
export class SliderController {
  constructor(private readonly sliderService: SliderService) {}

  @Get(':city')
  sliderList(
    @Param('city') city: CityShort,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<SliderDto[]> {
    if (!Object.values(CityShort).includes(city)) {
      return new Promise((res) => res([]));
    }

    const longCity = Object.entries(CityShort).find(
      (shortCity) => shortCity[1] === city,
    )[0];

    const props: PostOptions = { offset: 0, count: count ?? 20 };
    props.filter = { ...filter, city: longCity };

    return this.sliderService.getSliderList(props);
  }
}
