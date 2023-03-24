import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uidv4 } from 'uuid';
import { EventDates } from '../../typeorm';
import { EventDatesDto } from '../dtos/EventDates.dto';
import { EditEventDateDto } from '../dtos/EditEventDate.dto';
import { Exception500 } from '../../utils/types/enums';
import { EventsUtilsService } from './events.utils.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { MapUtilsService } from '../../map/services/map.utils.service';

@Injectable()
export class EventDatesService {
  constructor(
    private readonly mapUtilsService: MapUtilsService,

    @Inject(EventsUtilsService)
    private readonly eventsUtilsService: EventsUtilsService,

    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
  ) {}

  async getEventDates(uid: string): Promise<EventDates[]> {
    const event = await this.eventsUtilsService.getEventByUid(uid);

    return this.eventsUtilsService.getEventDatesByEventId(event.id);
  }

  async saveTemplateEventDate(eventUid: string): Promise<EventDatesDto> {
    const uid = uidv4();
    const event = await this.eventsUtilsService.getEventByUid(eventUid);

    const createEventDates = this.eventDatesRepo.create({ uid, event });
    const eventDates = await this.eventDatesRepo.save(createEventDates);

    return plainToClassResponse(EventDatesDto, eventDates);
  }

  async saveEventDate(eventUid: string): Promise<EventDates> {
    const uid = uidv4();
    const event = await this.eventsUtilsService.getEventByUid(eventUid);

    const eventDates = this.eventDatesRepo.create({ uid, event });
    return this.eventDatesRepo.save(eventDates);
  }

  async deleteEventDate(uid: string): Promise<EventDatesDto> {
    const eventDateFromDb = await this.eventsUtilsService.getEventDateByUid(
      uid,
    );
    const eventDates = await this.eventDatesRepo.remove(eventDateFromDb);

    return plainToClassResponse(EventDatesDto, eventDates);
  }

  async editEventDate(data: EditEventDateDto): Promise<EventDatesDto> {
    const { uid, map, ...eventDateData } = data;

    if (!uid) {
      throw new InternalServerErrorException(Exception500.editNoEventDateId);
    }
    const eventDateFromDb = await this.eventsUtilsService.getEventDateByUid(
      uid,
    );
    const mapFromDb = map?.uid
      ? await this.mapUtilsService.getMapByUid(map.uid)
      : null;

    const createEventDates = this.eventDatesRepo.create(eventDateData);
    const eventDates = await this.eventDatesRepo.save({
      ...eventDateFromDb,
      ...createEventDates,
      map: mapFromDb,
    });

    return plainToClassResponse(EventDatesDto, eventDates);
  }
}
