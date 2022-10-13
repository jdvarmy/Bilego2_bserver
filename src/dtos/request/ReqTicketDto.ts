import { ArrayMinSize, IsArray } from 'class-validator';
import { TicketDto } from '../TicketDto';
import { TicketSellDto } from '../TicketSellDto';

export class ReqTicketDto {
  @IsArray()
  @ArrayMinSize(1)
  tickets: TicketDto[];

  @IsArray()
  @ArrayMinSize(1)
  sell: TicketSellDto[];
}
