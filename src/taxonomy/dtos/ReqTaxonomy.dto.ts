import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { TaxonomyType, TaxonomyTypeLink } from '../../types/enums';

export class ReqTaxonomyDto {
  @IsOptional()
  @IsString()
  uid?: string;

  @IsOptional()
  @IsString()
  type?: TaxonomyType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  link?: TaxonomyTypeLink;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  icon?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  image?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  overIndex?: number;

  @IsOptional()
  @IsBoolean()
  showInMenu?: boolean;

  @IsOptional()
  @IsBoolean()
  showInMainPage?: boolean;
}
