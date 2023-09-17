import { EventTaxonomyDto } from '../../events/dtos/event-taxonomy.dto';
import { EventDatesDto } from '../../events/dtos/event-dates.dto';
import { MediaDto } from '../../medialibrary/dtos/media.dto';
import { Events } from '../../events/entity/events.entity';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';
import { getActualDate } from '../../../utils/helpers/getActualDate';
import { ItemShortDto } from '../../items/dtos/item-short.dto';

export class SliderDto {
  uid: string;
  slug: string;
  title?: string;
  artist?: any;
  taxonomy?: EventTaxonomyDto[];
  eventDate?: EventDatesDto;
  item?: ItemShortDto;
  image?: MediaDto;
  fragment?: string;
  ageRestriction?: number;

  constructor(event: Events) {
    this.uid = event.uid;
    this.slug = event.slug;
    this.title = event.title;
    this.artist = event.artist;
    this.taxonomy = event.taxonomy?.map((tax) =>
      plainToClassResponse(EventTaxonomyDto, tax),
    );
    this.eventDate =
      Array.isArray(event.eventDates) && event.eventDates.length
        ? plainToClassResponse(
            EventDatesDto,
            getActualDate(event.eventDates).present,
          )
        : ({} as EventDatesDto);
    this.item = this.item = event.item
      ? plainToClassResponse(ItemShortDto, event.item)
      : undefined;
    this.image = event.image
      ? plainToClassResponse(MediaDto, event.image, true)
      : undefined;
    this.fragment = event.fragment;
    this.ageRestriction = event.ageRestriction;
  }
}
