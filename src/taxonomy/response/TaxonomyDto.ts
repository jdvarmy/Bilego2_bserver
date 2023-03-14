import { MediaType } from '../../types/types';
import { Taxonomy } from '../../typeorm';
import { TaxonomyType, TaxonomyTypeLink } from '../../types/enums';
import { MediaDto } from '../../dtos/MediaDto';

export class TaxonomyDto {
  uid: string | number;
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
    this.uid = taxonomy.uid;
    this.name = taxonomy.name;
    this.slug = taxonomy.slug;
    this.type = taxonomy.type;
    this.link = taxonomy.link;
    this.description = taxonomy.description;
    this.icon = taxonomy.icon ? new MediaDto(taxonomy.icon, true) : undefined;
    this.image = taxonomy.image ? new MediaDto(taxonomy.icon, true) : undefined;
    this.overIndex = taxonomy.overIndex || undefined;
    this.showInMenu = taxonomy.showInMenu;
    this.showInMainPage = taxonomy.showInMainPage;
  }
}
