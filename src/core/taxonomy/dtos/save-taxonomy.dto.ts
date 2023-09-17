import { ReqTaxonomyDto } from './req-taxonomy.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { TaxonomyType, TaxonomyTypeLink } from '../../../utils/types/enums';

export class SaveTaxonomyDto extends ReqTaxonomyDto {
  @IsNotEmpty()
  @IsString()
  type: TaxonomyType;

  @IsNotEmpty()
  @IsString()
  link: TaxonomyTypeLink;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;
}
