import { TicketType } from '../../utils/types/enums';
import { TicketSellDto } from './TicketSell.dto';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { Tickets } from '../../typeorm';

export class TicketDto {
  uid: string;
  type: TicketType;
  name?: string;
  description?: string;
  seat?: string;
  row?: string;
  sector?: string;
  stock: number;
  sell?: TicketSellDto[];

  constructor(ticket: Tickets) {
    this.uid = ticket.uid;
    this.type = ticket.type;
    this.name = ticket.name;
    this.description = ticket.description;
    this.seat = ticket.seat;
    this.row = ticket.row;
    this.sector = ticket.sector;
    this.stock = ticket.stock;
    this.sell = plainToClassResponse(TicketSellDto, ticket.ticketsSell || []);
  }
}
