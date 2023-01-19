import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReqEvent } from './ReqEvent';
import { ReqEventDateDto } from './ReqEventDateDto';

export class PutEventDto extends ReqEvent {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsOptional()
  eventDates?: ReqEventDateDto[];

  @IsOptional()
  @IsNumber()
  image?: number;

  @IsOptional()
  @IsNumber()
  headerImage?: number;

  @IsOptional()
  @IsString()
  item?: string;

  @IsOptional()
  @IsArray()
  artist?: string[];

  @IsOptional()
  @IsString()
  eventManager?: string;
}
