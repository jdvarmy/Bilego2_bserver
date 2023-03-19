import { ArrayNotEmpty, IsArray } from 'class-validator';
import { TicketDto } from './Ticket.dto';
import { TicketSellDto } from './TicketSell.dto';

export class SaveTicketDto {
  @IsArray()
  @ArrayNotEmpty()
  tickets: TicketDto[];

  @IsArray()
  @ArrayNotEmpty()
  sell: TicketSellDto[];
}
