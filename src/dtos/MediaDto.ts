import { Media } from '../typeorm';

export class MediaDto {
  id: number;
  name: string;
  originalName: string;
  path: string;
  mimetype: string;
  encoding: string;
  size: number;

  constructor(image: Media, short = false) {
    this.id = image.id;
    this.name = image.name || image.originalName;
    this.path = image.path;
    if (!short) {
      this.originalName = image.originalName;
      this.mimetype = image.mimetype;
      this.encoding = image.encoding;
      this.size = image.size;
    }
  }
}
