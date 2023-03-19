import { Items } from '../../typeorm';
import { City, PostStatus } from '../../types/enums';
import { EventTaxonomyDto } from '../../events/dtos/EventTaxonomy.dto';
import { MediaDto } from '../../medialibrary/dtos/Media.dto';
import { plainToClassResponse } from '../../helpers/plainToClassResponse';

export class ItemDto {
  uid: string;
  slug: string;
  status: PostStatus;
  title?: string;
  text?: string;
  create: Date;
  update?: Date;
  city?: City;
  seo?: any;
  taxonomy?: EventTaxonomyDto[];
  image?: MediaDto;
  headerImage?: MediaDto;
  fragment?: string;
  searchWords?: string;
  address?: string;
  latitude?: string;
  longitude?: string;

  constructor(item: Items) {
    this.uid = item.uid;
    this.slug = item.slug;
    this.status = item.status;
    this.title = item.title;
    this.text = item.text;
    this.create = item.createDateTime;
    this.update = item.updateDateTime;
    this.city = item.city;
    this.seo = item.seo;
    this.taxonomy = item.taxonomy?.map((tax) =>
      plainToClassResponse(EventTaxonomyDto, tax),
    );
    this.image = item.image
      ? plainToClassResponse(MediaDto, item.image, true)
      : undefined;
    this.headerImage = item.headerImage
      ? plainToClassResponse(MediaDto, item.headerImage, true)
      : undefined;
    this.fragment = item.fragment;
    this.searchWords = item.searchWords;
    this.address = item.address;
    this.latitude = item.latitude;
    this.longitude = item.longitude;
  }
}
