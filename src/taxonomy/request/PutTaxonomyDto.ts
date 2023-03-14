import { ReqTaxonomy } from './ReqTaxonomy';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PutTaxonomyDto extends ReqTaxonomy {
  @IsNotEmpty()
  @IsNumber()
  uid: string;
}
