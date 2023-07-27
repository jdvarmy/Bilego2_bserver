import { Controller, Get, Param, Query } from '@nestjs/common';
import { CityShort, Routs } from '../utils/types/enums';
import { PostOptions } from '../utils/types/types';
import { CityService } from './city.service';

@Controller(Routs.city)
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get(':city')
  getHomeEventList(
    @Param('city') city: CityShort,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string | boolean>,
  ) {
    if (!Object.values(CityShort).includes(city)) {
      return new Promise((res) => res({ items: [], props: { total: 0 } }));
    }

    const longCity = Object.entries(CityShort).find(
      (shortCity) => shortCity[1] === city,
    )[0];
    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
    props.filter = { ...filter, city: longCity };

    return this.cityService.fetchHomeEvents(props);
  }
}
