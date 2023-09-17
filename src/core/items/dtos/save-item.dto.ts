import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { City, PostStatus } from '../../../utils/types/enums';

export class SaveItemDto {
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
  taxonomy?: string[];

  @IsOptional()
  @IsString()
  fragment?: string;

  @IsOptional()
  @IsString()
  searchWords?: string;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  image?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
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
