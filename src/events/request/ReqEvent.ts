import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { City, PostStatus } from '../../types/enums';
import { EventTaxonomyDto } from '../response/EventTaxonomyDto';

export class ReqEvent {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  status?: PostStatus;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  city?: City;

  @IsOptional()
  @IsArray()
  taxonomy?: EventTaxonomyDto[];

  @IsOptional()
  @IsString()
  fragment?: string;

  @IsOptional()
  @IsString()
  searchWords?: string;

  @IsOptional()
  @IsNumber()
  ageRestriction?: number;

  @IsOptional()
  @IsBoolean()
  isShowOnSlider?: boolean;

  @IsOptional()
  @IsString()
  musicLink?: string;

  @IsOptional()
  @IsString()
  videoLink?: string;
}
