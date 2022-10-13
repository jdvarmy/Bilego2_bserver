import { TicketType } from '../types/enums';
import { TicketSellDto } from './TicketSellDto';

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

  constructor(ticket) {
    this.uid = ticket.uid;
    this.type = ticket.type;
    this.name = ticket.name;
    this.description = ticket.description;
    this.seat = ticket.seat;
    this.row = ticket.row;
    this.sector = ticket.sector;
    this.stock = ticket.stock;
    this.sell = ticket.ticketsSell.map((s) => new TicketSellDto(s));
  }
}
