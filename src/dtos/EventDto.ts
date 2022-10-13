import { EventDates, Events, Users } from '../typeorm';
import { City, EventHeaderType, PostStatus } from '../types/enums';
import { EventDatesDto } from './EventDatesDto';

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
  eventManager?: Users;
  taxonomy?: any;
  eventDates?: EventDatesDto[];
  image?: any;
  fragment?: string;
  searchWords?: string;
  ageRestriction?: number;
  isShowOnSlider?: boolean;
  musicLink?: string;
  videoLink?: string;
  headerType?: EventHeaderType;
  headerImage?: any;
  headerVideo?: any;
  headerTitle?: string;
  headerSubtitle?: string;
  headerMeta?: string;
  headerTextColor?: string;
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
    this.eventManager = event.eventManager;
    this.taxonomy = event.taxonomy;
    this.eventDates = event.eventDates.map((date) => new EventDatesDto(date));
    this.image = event.image;
    this.fragment = event.fragment;
    this.searchWords = event.searchWords;
    this.ageRestriction = event.ageRestriction;
    this.isShowOnSlider = event.isShowOnSlider;
    this.musicLink = event.musicLink;
    this.videoLink = event.videoLink;
    this.headerType = event.headerType;
    this.headerImage = event.headerImage;
    this.headerVideo = event.headerVideo;
    this.headerTitle = event.headerTitle;
    this.headerSubtitle = event.headerSubtitle;
    this.headerMeta = event.headerMeta;
    this.headerTextColor = event.headerTextColor;
    this.concertManagerInfo = event.concertManagerInfo;
    this.concertManagerPercentage = event.concertManagerPercentage;
  }
}
