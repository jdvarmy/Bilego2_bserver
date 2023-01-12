import {
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { City, EventHeaderType, PostStatus } from '../../types/enums';

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
  taxonomy?: number[];

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
  @IsString()
  concertManagerInfo?: string;

  @IsOptional()
  @IsNumber()
  concertManagerPercentage?: number;

  @IsOptional()
  @IsBoolean()
  isShowOnSlider?: boolean;

  @IsOptional()
  @IsString()
  musicLink?: string;

  @IsOptional()
  @IsString()
  videoLink?: string;

  @IsOptional()
  @IsString()
  headerMedia?: string;

  @IsOptional()
  @IsString()
  headerText?: string;

  @IsOptional()
  @IsString()
  headerTextColor?: string;

  @IsOptional()
  @IsString()
  headerType?: EventHeaderType;
}
