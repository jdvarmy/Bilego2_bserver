import { Media } from '../../typeorm';
import { isString } from '../../utils/types/tsGuards';

export class MediaDto {
  id: number;
  name: string;
  originalName: string;
  path: string;
  mimetype: string;
  size: number;

  constructor(image: Media, short = false) {
    this.id = image.id;
    this.name = image.name || image.originalName;
    this.path = isString(image.s3location)
      ? JSON.parse(image.s3location)
      : isString(image.path)
      ? JSON.parse(image.path)
      : image.path;
    if (!short) {
      this.originalName = image.originalName;
      this.mimetype = image.mimetype;
      this.size = image.size;
    }
  }
}
