import { TicketsSell } from '../../../database/entity';

export class TicketSellDto {
  uid: string;
  price: number;
  service?: number;
  dateFrom?: string;
  dateTo?: string;
  color: string;

  constructor(ticketSell: TicketsSell) {
    this.uid = ticketSell.uid;
    this.price = ticketSell.price;
    this.service = ticketSell.service;
    this.dateFrom = ticketSell.dateFrom;
    this.dateTo = ticketSell.dateTo;
    this.color = ticketSell.color;
  }
}
