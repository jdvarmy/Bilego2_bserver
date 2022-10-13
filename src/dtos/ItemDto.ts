import { Items } from '../typeorm';
import { City, PostStatus } from '../types/enums';

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
  }
}
