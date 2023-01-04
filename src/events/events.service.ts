import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDates, Events, Taxonomy } from '../typeorm';
import { Repository } from 'typeorm';
import { EventDto } from './response/EventDto';
import { v4 as uidv4 } from 'uuid';
import { Exception500 } from '../types/enums';
import { ReqEventDateDto } from './request/ReqEventDateDto';
import { EventDatesDto } from './response/EventDatesDto';
import { MapService } from '../map/map.service';
import { PatchEventDto } from './request/PatchEventDto';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { EventTaxonomyDto } from './response/EventTaxonomyDto';

@Injectable()
export class EventsService {
  constructor(
    private readonly apiService: ApiService,
    private readonly mapService: MapService,
    private readonly taxonomyService: TaxonomyService,
    @InjectRepository(Events) private eventsRepo: Repository<Events>,
    @InjectRepository(EventDates)
    private eventDatesRepo: Repository<EventDates>,
  ) {}

  // todo: refactor
  async getFilteredEvents(options) {
    return this.apiService.get<Event[]>('events', options);
  }

  async getEvent(uid: string) {
    return new EventDto(await this.getEventByUid(uid));
  }

  async saveEventTemplate(): Promise<EventDto> {
    const uid = uidv4();

    const event = this.eventsRepo.create({
      uid,
      slug: `new-event-${+new Date()}`,
    });
    await this.eventsRepo.save(event);

    await this.saveTemplateEventDate(event.uid);

    return new EventDto(await this.getEventByUid(uid));
  }

  async editEvent(data: PatchEventDto): Promise<EventDto> {
    const { uid, taxonomy, ...eventData } = data;

    const eventFromDb = await this.getEventByUid(uid);

    // taxonomy убираем дубли
    const taxonomies = (await this.getTaxonomies(taxonomy)).reduce(
      (acc, tax) => {
        if (acc.find((accTax) => accTax.id === tax.id)) {
          return acc;
        }

        acc.push(tax);
        return acc;
      },
      [],
    );

    const updateEventData = this.eventsRepo.create(eventData);
    return new EventDto(
      await this.eventsRepo.save({
        ...eventFromDb,
        taxonomy: taxonomies,
        ...updateEventData,
      }),
    );
  }

  // EVENT DATES
  async getEventDates(uid: string): Promise<EventDates[]> {
    const event = await this.getEventByUid(uid);

    return this.getEventDatesByEventId(event.id);
  }

  async saveTemplateEventDate(eventUid: string): Promise<EventDatesDto> {
    const uid = uidv4();
    const event = await this.getEventByUid(eventUid);

    const eventDates = this.eventDatesRepo.create({ uid, event });
    return new EventDatesDto(await this.eventDatesRepo.save(eventDates));
  }

  async deleteEventDate(uid: string): Promise<boolean> {
    const eventDateFromDb = await this.getEventDateByUid(uid);
    // todo: убрать await
    await this.eventDatesRepo.remove(eventDateFromDb);

    return true;
  }

  async editEventDate(data: ReqEventDateDto): Promise<EventDatesDto> {
    const { uid, map, ...eventDateData } = data;

    if (!uid) {
      throw new InternalServerErrorException(Exception500.editNoEventDateId);
    }
    const eventDateFromDb = await this.getEventDateByUid(uid);
    const mapFromDb = map?.uid
      ? await this.mapService.getMapByUid(map.uid)
      : null;

    const eventDates = this.eventDatesRepo.create(eventDateData);
    return new EventDatesDto(
      await this.eventDatesRepo.save({
        ...eventDateFromDb,
        ...eventDates,
        map: mapFromDb,
      }),
    );
  }

  // UTILS
  async getEventByUid(uid: string): Promise<Events> {
    const event = await this.eventsRepo.findOne({
      where: { uid },
      relations: { eventDates: { map: true }, taxonomy: {} },
    });

    if (!event) {
      throw new InternalServerErrorException(Exception500.findEvent);
    }

    return event;
  }

  async getEventDateByUid(uid: string): Promise<EventDates> {
    const eventDate = await this.eventDatesRepo.findOne({
      where: { uid },
      relations: ['map'],
    });

    if (!eventDate) {
      throw new InternalServerErrorException(Exception500.findEventDate);
    }

    return eventDate;
  }

  async getEventDatesByEventId(id: number): Promise<EventDates[]> {
    const eventDates = await this.eventDatesRepo
      .createQueryBuilder('dates')
      .where('dates.event = :event', {
        event: id,
      })
      .orderBy('dates.id', 'ASC')
      .getMany();

    if (!eventDates) {
      throw new InternalServerErrorException(Exception500.findEventDates);
    }

    return eventDates;
  }

  checkEventUid(uid1, uid2): boolean {
    if (uid1 !== uid2) {
      throw new InternalServerErrorException(Exception500.eventUid);
    }

    return true;
  }

  async getTaxonomies(taxonomies: EventTaxonomyDto[]): Promise<Taxonomy[]> {
    const result = [];
    taxonomies.forEach((taxonomy) => {
      result.push(this.taxonomyService.getTaxonomyById(taxonomy.id));
    });

    return Promise.all(result);
  }
}
