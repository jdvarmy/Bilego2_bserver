import { Taxonomy } from '../../../database/entity';
import { TaxonomyType } from '../../../utils/types/enums';

export class EventTaxonomyDto {
  uid: string;
  name: string;
  slug: string;
  type: TaxonomyType;

  constructor(taxonomy: Taxonomy) {
    this.uid = taxonomy.uid;
    this.name = taxonomy.name;
    this.slug = taxonomy.slug;
    this.type = taxonomy.type;
  }
}
