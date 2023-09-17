import { Items } from '../../../database/entity';

export class ItemShortDto {
  slug: string;
  title?: string;

  constructor(item: Items) {
    this.slug = item.slug;
    this.title = item.title;
  }
}
