import { Artists } from '../../../database/entity';
import { PostStatus } from '../../../utils/types/enums';
import { MediaDto } from '../../medialibrary/dtos/media.dto';

export class ArtistDto {
  uid: string;
  slug: string;
  status: PostStatus;
  title?: string;
  text?: string;
  image: MediaDto;
  avatar: MediaDto;
  create: Date;
  update?: Date;
  seo?: any;

  constructor(artist: Artists) {
    this.uid = artist.uid;
    this.slug = artist.slug;
    this.status = artist.status;
    this.title = artist.title;
    this.text = artist.text;
    this.image = artist.image ? new MediaDto(artist.image, true) : undefined;
    this.avatar = artist.avatar ? new MediaDto(artist.avatar, true) : undefined;
    this.create = artist.createDateTime;
    this.update = artist.updateDateTime;
    this.seo = artist.seo;
  }
}
