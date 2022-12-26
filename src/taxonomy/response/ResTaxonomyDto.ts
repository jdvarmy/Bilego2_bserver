import { MediaType } from '../../types/types';
import { Taxonomy } from '../../typeorm';
import { TaxonomyTypeLink } from '../../types/enums';

export class ResTaxonomyDto {
  id: string | number;
  name: string;
  slug: string;
  link: TaxonomyTypeLink;
  description: string;
  icon: MediaType;
  image: MediaType;

  constructor(taxonomy: Taxonomy) {
    this.id = taxonomy.id;
    this.name = taxonomy.name;
    this.slug = taxonomy.slug;
    this.link = taxonomy.link;
    this.description = taxonomy.description;
    this.icon = taxonomy.icon ? { path: taxonomy.icon.path } : undefined;
    this.image = taxonomy.image ? { path: taxonomy.image.path } : undefined;
  }
}
