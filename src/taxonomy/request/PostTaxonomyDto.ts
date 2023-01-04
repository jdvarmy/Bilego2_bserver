import { ReqTaxonomy } from './ReqTaxonomy';
import { IsNotEmpty, IsString } from 'class-validator';
import { TaxonomyType, TaxonomyTypeLink } from '../../types/enums';

export class PostTaxonomyDto extends ReqTaxonomy {
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
