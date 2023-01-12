import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReqEvent } from './ReqEvent';
import { ReqEventDateDto } from './ReqEventDateDto';

export class PutEventDto extends ReqEvent {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsOptional()
  eventDates?: ReqEventDateDto;

  @IsOptional()
  @IsNumber()
  headerImage?: number;
}
