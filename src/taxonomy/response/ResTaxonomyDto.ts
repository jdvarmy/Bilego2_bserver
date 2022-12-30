import { MediaType } from '../../types/types';
import { Taxonomy } from '../../typeorm';
import { TaxonomyType, TaxonomyTypeLink } from '../../types/enums';

export class ResTaxonomyDto {
  id: string | number;
  name: string;
  slug: string;
  type: TaxonomyType;
  link: TaxonomyTypeLink;
  description: string;
  icon: MediaType;
  image: MediaType;
  overIndex: number | undefined;
  showInMenu: boolean;
  showInMainPage: boolean;

  constructor(taxonomy: Taxonomy) {
    this.id = taxonomy.id;
    this.name = taxonomy.name;
    this.slug = taxonomy.slug;
    this.type = taxonomy.type;
    this.link = taxonomy.link;
    this.description = taxonomy.description;
    this.icon = taxonomy.icon ? { path: taxonomy.icon.path } : undefined;
    this.image = taxonomy.image ? { path: taxonomy.image.path } : undefined;
    // this.overIndex = taxonomy.overIndex || undefined;
    this.showInMenu = taxonomy.showInMenu;
    this.showInMainPage = taxonomy.showInMainPage;
  }
}
