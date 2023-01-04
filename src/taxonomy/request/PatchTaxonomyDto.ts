import { ReqTaxonomy } from './ReqTaxonomy';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PatchTaxonomyDto extends ReqTaxonomy {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
