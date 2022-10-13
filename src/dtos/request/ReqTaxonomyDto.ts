import {
  IsOptional,
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { TaxonomyType } from '../../types/enums';

export class ReqTaxonomyDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  type: TaxonomyType;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  icon: number;

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
