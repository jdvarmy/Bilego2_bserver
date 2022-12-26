import { ReqTaxonomyDto } from './ReqTaxonomyDto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PatchTaxonomyDto extends ReqTaxonomyDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
