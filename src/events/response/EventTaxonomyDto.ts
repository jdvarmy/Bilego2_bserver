import { Taxonomy } from '../../typeorm';
import { TaxonomyType } from '../../types/enums';

export class EventTaxonomyDto {
  uid: string;
  name: string;
  type: TaxonomyType;

  constructor(taxonomy: Taxonomy) {
    this.uid = taxonomy.uid;
    this.name = taxonomy.name;
    this.type = taxonomy.type;
  }
}
