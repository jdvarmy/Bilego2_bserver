import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { EventDto } from '../dtos/event.dto';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { CityShort, Routs } from '../../utils/types/enums';
import { getLongCity } from '../../utils/helpers/getLongCity';

@Controller(Routs.eventsPublic)
export class EventsClientController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getEventList(
    @Query('c') city: CityShort,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: EventDto[]; props: ItemsPageProps }> {
    const longCity = getLongCity(city);
    if (!longCity) {
      return new Promise((res) => res({ items: [], props: { total: 0 } }));
    }

    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
    props.filter = { ...filter, city: longCity };

    return this.eventService.fetchEventsClient(props);
  }

  @Get(':uid')
  getEvent(@Param('uid') uid: string): Promise<EventDto> {
    return this.eventService.getEvent(uid);
  }
}
