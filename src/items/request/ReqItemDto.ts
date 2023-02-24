import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { City, PostStatus } from '../../types/enums';

export class ReqItemDto {
  @IsOptional()
  @IsString()
  uid?: string;

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
  image?: number;

  @IsOptional()
  @IsNumber()
  headerImage?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;
}
