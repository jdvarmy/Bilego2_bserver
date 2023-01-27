import { Events } from '../../typeorm';
import { City, EventHeaderType, PostStatus } from '../../types/enums';
import { EventDatesDto } from './EventDatesDto';
import { EventTaxonomyDto } from './EventTaxonomyDto';
import { MediaDto } from '../../dtos/MediaDto';
import { UserDto } from '../../dtos/UserDto';

export class EventDto {
  uid: string;
  slug: string;
  status: PostStatus;
  title?: string;
  text?: string;
  create: Date;
  update?: Date;
  artist?: any;
  item?: any;
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
    this.item = event.item;
    this.city = event.city;
    this.eventManager = event.eventManager
      ? new UserDto(event.eventManager)
      : undefined;
    this.taxonomy = event.taxonomy?.map((tax) => new EventTaxonomyDto(tax));
    this.eventDates = event.eventDates?.map((date) => new EventDatesDto(date));
    this.image = event.image ? new MediaDto(event.image, true) : undefined;
    this.fragment = event.fragment;
    this.searchWords = event.searchWords;
    this.ageRestriction = event.ageRestriction;
    this.isShowOnSlider = event.isShowOnSlider;
    this.musicLink = event.musicLink;
    this.videoLink = event.videoLink;
    this.headerType = event.headerType;
    this.headerImage = event.headerImage
      ? new MediaDto(event.headerImage, true)
      : undefined;
    this.headerMedia = event.headerMedia;
    this.headerText = event.headerText;
    this.headerTextColor = event.headerTextColor;
    this.concertManagerInfo = event.concertManagerInfo;
    this.concertManagerPercentage = event.concertManagerPercentage;
  }
}
