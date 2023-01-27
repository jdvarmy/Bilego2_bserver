import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artists, EventDates, Events, Taxonomy } from '../typeorm';
import { Repository } from 'typeorm';
import { EventDto } from './response/EventDto';
import { v4 as uidv4 } from 'uuid';
import { City, Exception500 } from '../types/enums';
import { ReqEventDateDto } from './request/ReqEventDateDto';
import { EventDatesDto } from './response/EventDatesDto';
import { MapService } from '../map/map.service';
import { PatchEventDto } from './request/PatchEventDto';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { PutEventDto } from './request/PutEventDto';
import { MedialibraryService } from '../medialibrary/medialibrary.service';
import { ItemsService } from '../items/items.service';
import { ArtistsService } from '../artists/artists.service';
import { UsersService } from '../users/users.service';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class EventsService {
  constructor(
    private readonly mapService: MapService,
    private readonly itemsService: ItemsService,
    private readonly artistsService: ArtistsService,
    private readonly usersService: UsersService,
    private readonly taxonomyService: TaxonomyService,
    private readonly medialibraryService: MedialibraryService,
    @InjectRepository(Events) private eventsRepo: Repository<Events>,
    @InjectRepository(EventDates)
    private eventDatesRepo: Repository<EventDates>,
  ) {}

  async getFilteredEvents(options: {
    city?: City;
    offset: number;
    count: number;
  }) {
    const events = await this.eventsRepo
      .createQueryBuilder('events')
      .select([
        'events.uid',
        'events.status',
        'events.city',
        'events.title',
        'events.slug',
        'events.isShowOnSlider',
        'events.eventManager',
        'events.concertManagerPercentage',
      ])
      .leftJoinAndSelect('events.eventDates', 'dates')
      .leftJoinAndSelect('events.item', 'item')
      .leftJoinAndSelect('events.artist', 'artist')
      .orderBy('events.id', 'ASC')
      .offset(options.offset)
      .limit(options.count)
      .getMany();

    return events.map((event) => new EventDto(event));
  }

  async getEvent(uid: string) {
    return new EventDto(
      await this.getEventByUid(uid, {
        item: true,
        artist: true,
        eventManager: true,
        eventDates: { map: true },
        taxonomy: true,
        headerImage: true,
        image: true,
      }),
    );
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
    const {
      uid,
      taxonomy,
      eventDates,
      headerImage,
      image,
      item,
      artist,
      eventManager,
      ...eventData
    } = data;

    const eventFromDb = await this.getEventByUid(uid);
    const relations: Partial<Event> = {};

    // Обновляем площадку
    if (item) {
      relations['item'] = await this.itemsService.getItemByUid(item);
    }

    // Обновляем артистов
    if (artist) {
      relations['artist'] = await this.getArtists(artist);
    }

    // Обновляем менеджера события
    if (eventManager) {
      relations['eventManager'] = await this.usersService.getUserByUid(
        eventManager,
      );
    }

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.getTaxonomies([...new Set(taxonomy)]);
    }

    // Обновляем картинку события
    if (image) {
      relations['image'] = await this.medialibraryService.getMediaById(image);
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

  async getEventByUid(
    uid: string,
    relations: FindOptionsRelations<Events> = {
      eventDates: { map: true },
      taxonomy: true,
      headerImage: true,
      image: true,
    },
  ): Promise<Events> {
    const event = await this.eventsRepo.findOne({
      where: { uid },
      relations,
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

  // todo: поменять на event uid
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

  async getArtists(artists: string[]): Promise<Artists[]> {
    const result = [];
    artists.forEach((artistUid) => {
      result.push(this.artistsService.getArtistByUid(artistUid));
    });

    return Promise.all(result);
  }

  async getTaxonomies(taxonomies: number[]): Promise<Taxonomy[]> {
    const result = [];
    taxonomies.forEach((taxonomyId) => {
      result.push(this.taxonomyService.getTaxonomyById(taxonomyId));
    });

    return Promise.all(result);
  }
}
