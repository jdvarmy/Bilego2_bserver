import { ReqTaxonomyDto } from './ReqTaxonomy.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class EditTaxonomyDto extends ReqTaxonomyDto {
  @IsNotEmpty()
  @IsString()
  uid: string;
}
