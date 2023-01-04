import { Taxonomy } from '../../typeorm';
import { TaxonomyType } from '../../types/enums';

export class EventTaxonomyDto {
  id: number;
  name: string;
  type: TaxonomyType;

  constructor(taxonomy: Taxonomy) {
    this.id = taxonomy.id;
    this.name = taxonomy.name;
    this.type = taxonomy.type;
  }
}
