import { TicketType } from '../../../utils/types/enums';
import { EventDates } from '../../../database/entity';
import { MapDto } from '../../map/dtos/map.dto';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';

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
    this.dateFrom = eventDate.dateFrom
      ? new Date(
          eventDate.dateFrom.getTime() -
            eventDate.dateFrom.getTimezoneOffset() * 60000,
        )
      : undefined;
    this.dateTo = eventDate.dateTo
      ? new Date(
          eventDate.dateTo.getTime() -
            eventDate.dateTo.getTimezoneOffset() * 60000,
        )
      : undefined;
    this.closeDateTime = eventDate.closeDateTime
      ? new Date(
          eventDate.closeDateTime.getTime() -
            eventDate.closeDateTime.getTimezoneOffset() * 60000,
        )
      : undefined;
    this.map = eventDate.map
      ? plainToClassResponse(MapDto, eventDate.map)
      : undefined;
  }
}
