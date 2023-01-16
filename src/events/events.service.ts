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
import { PutEventDto } from './request/PutEventDto';
import { MedialibraryService } from '../medialibrary/medialibrary.service';

@Injectable()
export class EventsService {
  constructor(
    private readonly apiService: ApiService,
    private readonly mapService: MapService,
    private readonly taxonomyService: TaxonomyService,
    private readonly medialibraryService: MedialibraryService,
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

  async saveEvent(data: PutEventDto): Promise<EventDto> {
    const { uid, taxonomy, eventDates, headerImage, ...eventData } = data;

    const eventFromDb = await this.getEventByUid(uid);
    const relations: Partial<Event> = {};

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.getTaxonomies([...new Set(taxonomy)]);
    }

    // Обновляем заголовок события
    if (headerImage) {
      relations['headerImage'] = await this.medialibraryService.getMediaById(
        headerImage,
      );
    }

    // Обновляем даты проведения события
    if (eventDates) {
      for (const date of eventDates) {
        const { uid: dateUid, ...eventDateData } = date;
        const eventDateFromDb = await this.getEventDateByUid(dateUid);
        const eventDate = this.eventDatesRepo.create(eventDateData);
        this.eventDatesRepo.save({
          ...eventDateFromDb,
          ...eventDate,
        });
      }
    }

    const updateEventData = this.eventsRepo.create(eventData);
    await this.eventsRepo.save({
      ...eventFromDb,
      ...updateEventData,
      ...relations,
    });

    return this.getEvent(uid);
  }

  async editEvent(data: PatchEventDto): Promise<EventDto> {
    const { uid, taxonomy, ...eventData } = data;

    const eventFromDb = await this.getEventByUid(uid);

    // taxonomy убираем дубли
    const taxonomies = await this.getTaxonomies([...new Set(taxonomy)]);

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

  async saveEventDate(eventUid: string): Promise<EventDates> {
    const uid = uidv4();
    const event = await this.getEventByUid(eventUid);

    const eventDates = this.eventDatesRepo.create({ uid, event });
    return this.eventDatesRepo.save(eventDates);
  }

  async deleteEventDate(uid: string): Promise<EventDatesDto> {
    const eventDateFromDb = await this.getEventDateByUid(uid);
    return new EventDatesDto(await this.eventDatesRepo.remove(eventDateFromDb));
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
  checkEventUid(uid1, uid2): boolean {
    if (uid1 !== uid2) {
      throw new InternalServerErrorException(Exception500.eventUid);
    }

    return true;
  }

  async getEventByUid(uid: string): Promise<Events> {
    const event = await this.eventsRepo.findOne({
      where: { uid },
      relations: {
        eventDates: { map: true },
        taxonomy: {},
        headerImage: {},
        image: {},
      },
    });

    if (!event) {
      throw new InternalServerErrorException(Exception500.findEvent);
    }

    return event;
  }

  async getEventDateByUid(
    uid: string,
    relations = ['map'],
  ): Promise<EventDates> {
    const eventDate = await this.eventDatesRepo.findOne({
      where: { uid },
      relations,
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

  async getTaxonomies(taxonomies: number[]): Promise<Taxonomy[]> {
    const result = [];
    taxonomies.forEach((taxonomyId) => {
      result.push(this.taxonomyService.getTaxonomyById(taxonomyId));
    });

    return Promise.all(result);
  }
}
