import { Artists } from '../typeorm';
import { PostStatus } from '../types/enums';

export class ArtistDto {
  uid: string;
  slug: string;
  status: PostStatus;
  title?: string;
  text?: string;
  create: Date;
  update?: Date;
  seo?: any;

  constructor(artist: Artists) {
    this.uid = artist.uid;
    this.slug = artist.slug;
    this.status = artist.status;
    this.title = artist.title;
    this.text = artist.text;
    this.create = artist.createDateTime;
    this.update = artist.updateDateTime;
    this.seo = artist.seo;
  }
}
