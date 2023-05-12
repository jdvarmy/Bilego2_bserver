import { MediaType } from '../../utils/types/types';
import { Taxonomy } from '../../database/entity';
import { TaxonomyType, TaxonomyTypeLink } from '../../utils/types/enums';
import { MediaDto } from '../../medialibrary/dtos/Media.dto';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';

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
    this.icon = taxonomy.icon
      ? plainToClassResponse(MediaDto, taxonomy.icon, true)
      : undefined;
    this.image = taxonomy.image
      ? plainToClassResponse(MediaDto, taxonomy.icon, true)
      : undefined;
    this.overIndex = taxonomy.overIndex || undefined;
    this.showInMenu = taxonomy.showInMenu;
    this.showInMainPage = taxonomy.showInMainPage;
  }
}
