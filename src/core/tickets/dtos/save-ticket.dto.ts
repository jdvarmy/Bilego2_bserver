import { ArrayNotEmpty, IsArray } from 'class-validator';
import { TicketDto } from './ticket.dto';
import { TicketSellDto } from './ticket-sell.dto';

export class SaveTicketDto {
  @IsArray()
  @ArrayNotEmpty()
  tickets: TicketDto[];

  @IsArray()
  @ArrayNotEmpty()
  sell: TicketSellDto[];
}
