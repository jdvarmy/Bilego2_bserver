import { IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { TaxonomyType, TaxonomyTypeLink } from '../../types/enums';

export class ReqTaxonomyDto {
  @IsOptional()
  @IsNumber()
  id?: number;

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
  @IsNumber()
  icon?: number;

  @IsOptional()
  @IsNumber()
  image?: number;

  @IsOptional()
  @IsNumber()
  sortNumber?: number;

  @IsOptional()
  @IsBoolean()
  showInMenu?: boolean;

  @IsOptional()
  @IsBoolean()
  showInMainPage?: boolean;
}
