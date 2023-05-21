import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { SaveEventDto } from './save-event.dto';
import { EditEventDateDto } from './edit-event-date.dto';

export class EditEventDto extends SaveEventDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsOptional()
  eventDates?: EditEventDateDto[];

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
  image?: number;

  @IsOptional()
  @IsNumber({ allowNaN: false, allowInfinity: false })
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
