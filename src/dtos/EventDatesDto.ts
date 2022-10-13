import { TicketType } from '../types/enums';
import { EventDates } from '../typeorm';
import { MapDto } from './MapDto';

export class EventDatesDto {
  uid: string;
  type?: TicketType;
  dateFrom?: Date;
  dateTo?: Date;
  closeDateTime?: Date;
  map?: MapDto;

  constructor(eventDate: EventDates) {
    this.uid = eventDate.uid;
    this.type = eventDate.type;
    this.dateFrom = eventDate.dateFrom;
    this.dateTo = eventDate.dateTo;
    this.closeDateTime = eventDate.closeDateTime;
    this.map = eventDate.map ? new MapDto(eventDate.map) : undefined;
  }
}
