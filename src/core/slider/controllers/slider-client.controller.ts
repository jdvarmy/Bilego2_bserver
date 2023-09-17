import { Controller, Get, Query } from '@nestjs/common';
import { CityShort, Routs } from '../../../utils/types/enums';
import { PostOptions } from '../../../utils/types/types';
import { SliderService } from '../services/slider.service';
import { SliderDto } from '../dtos/slider.dto';
import { getLongCity } from '../../../utils/helpers/getLongCity';

@Controller(Routs.sliderPublic)
export class SliderClientController {
  constructor(private readonly sliderService: SliderService) {}

  @Get()
  sliderList(
    @Query('c') city: CityShort,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<SliderDto[]> {
    const longCity = getLongCity(city);
    if (!longCity) {
      return new Promise((res) => res([]));
    }

    const props: PostOptions = { offset: 0, count: count ?? 20 };
    props.filter = { ...filter, city: longCity };

    return this.sliderService.getSliderList(props);
  }
}
