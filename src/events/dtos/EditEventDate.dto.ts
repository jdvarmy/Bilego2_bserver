import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { TicketType } from '../../types/enums';

export class EditEventDateDto {
  @IsNotEmpty()
  @IsString()
  uid: string;

  @IsOptional()
  @IsObject()
  map?: any;

  @IsOptional()
  @IsString()
  type?: TicketType;

  @IsOptional()
  @IsString()
  dateFrom?: Date;

  @IsOptional()
  @IsString()
  dateTo?: Date;

  @IsOptional()
  @IsString()
  closeDateTime?: Date;
}
