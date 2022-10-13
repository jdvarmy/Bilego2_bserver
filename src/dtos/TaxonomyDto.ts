import { MediaType } from '../types/types';
import { Taxonomy } from '../typeorm';

export class TaxonomyDto {
  name: string;
  slug: string;
  description: string;
  icon: MediaType;
  image: MediaType;

  constructor(taxonomy: Taxonomy) {
    this.name = taxonomy.name;
    this.slug = taxonomy.slug;
    this.description = taxonomy.description;
    this.icon = taxonomy.icon
      ? {
          id: taxonomy.icon.id,
          name: taxonomy.icon.name || taxonomy.icon.originalName,
        }
      : undefined;
    this.image = taxonomy.image
      ? {
          id: taxonomy.image.id,
          name: taxonomy.image.name || taxonomy.image.originalName,
        }
      : undefined;
  }
}
