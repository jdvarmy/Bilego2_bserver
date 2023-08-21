import { Events } from '../../database/entity';
import { City, EventHeaderType, PostStatus } from '../../utils/types/enums';
import { EventDatesDto } from './event-dates.dto';
import { EventTaxonomyDto } from './event-taxonomy.dto';
import { MediaDto } from '../../medialibrary/dtos/media.dto';
import { UserDto } from '../../users/dtos/user.dto';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { ItemDto } from '../../items/dtos/item.dto';

export class EventDto {
  uid: string;
  slug: string;
  status: PostStatus;
  title?: string;
  text?: string;
  create: Date;
  update?: Date;
  artist?: any;
  item?: ItemDto;
  city?: City;
  seo?: any;
  taxonomy?: EventTaxonomyDto[];
  eventDates?: EventDatesDto[];
  image?: MediaDto;
  fragment?: string;
  searchWords?: string;
  ageRestriction?: number;
  isShowOnSlider?: boolean;
  musicLink?: string;
  videoLink?: string;
  headerType?: EventHeaderType;
  headerImage?: MediaDto;
  headerMedia?: string;
  headerText?: string;
  headerTextColor?: string;
  eventManager?: UserDto;
  concertManagerInfo?: string;
  concertManagerPercentage?: number;

  constructor(event: Events) {
    this.uid = event.uid;
    this.slug = event.slug;
    this.status = event.status;
    this.title = event.title;
    this.text = event.text;
    this.create = event.createDateTime;
    this.update = event.updateDateTime;
    this.seo = event.seo;
    this.artist = event.artist;
    this.item = event.item
      ? plainToClassResponse(ItemDto, event.item)
      : undefined;
    this.city = event.city;
    this.eventManager = event.eventManager
      ? new UserDto(event.eventManager)
      : undefined;
    this.taxonomy = event.taxonomy?.map((tax) =>
      plainToClassResponse(EventTaxonomyDto, tax),
    );
    this.eventDates = event.eventDates?.map((date) =>
      plainToClassResponse(EventDatesDto, date),
    );
    this.image = event.image
      ? plainToClassResponse(MediaDto, event.image, true)
      : undefined;
    this.fragment = event.fragment;
    this.searchWords = event.searchWords;
    this.ageRestriction = event.ageRestriction;
    this.isShowOnSlider = event.isShowOnSlider;
    this.musicLink = event.musicLink;
    this.videoLink = event.videoLink;
    this.headerType = event.headerType;
    this.headerImage = event.headerImage
      ? plainToClassResponse(MediaDto, event.headerImage, true)
      : undefined;
    this.headerMedia = event.headerMedia;
    this.headerText = event.headerText;
    this.headerTextColor = event.headerTextColor;
    this.concertManagerInfo = event.concertManagerInfo;
    this.concertManagerPercentage = event.concertManagerPercentage;
  }
}
