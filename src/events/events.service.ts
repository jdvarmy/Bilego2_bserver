import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Artists, EventDates, Events } from '../typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { EventDto } from './response/EventDto';
import { v4 as uidv4 } from 'uuid';
import { Exception500 } from '../types/enums';
import { ReqEventDateDto } from './request/ReqEventDateDto';
import { EventDatesDto } from './response/EventDatesDto';
import { MapService } from '../map/map.service';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { PutEventDto } from './request/PutEventDto';
import { MedialibraryService } from '../medialibrary/medialibrary.service';
import { ItemsService } from '../items/items.service';
import { ArtistsService } from '../artists/artists.service';
import { UsersService } from '../users/users.service';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { ItemsPageProps, PostOptions } from '../types/types';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

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

  async getEventList(
    options: PostOptions,
  ): Promise<{ items: EventDto[]; props: ItemsPageProps }> {
    const query = await this.eventsRepo
      .createQueryBuilder('events')
      .select([
        'events.id',
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
      .leftJoinAndSelect('events.eventManager', 'eventManager')
      .orderBy('events.id', 'ASC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) => this.andWhereCondition(builder, options.filter));
    }

    const events = await query.getMany();

    if (!events) {
      throw new InternalServerErrorException(Exception500.findEvents);
    }

    return {
      items: events.map((event) => new EventDto(event)),
      props: { total: await this.getTotal(options.filter) },
    };
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
    const relations: Partial<Events> = {};

    // Обновляем площадку
    if (item) {
      relations['item'] = await this.itemsService.getItemByUid(item);
    }

    // Обновляем артистов
    if (artist) {
      relations['artists'] = await this.getArtists(artist);
    }

    // Обновляем менеджера события
    if (eventManager) {
      relations['eventManager'] = await this.usersService.getUserByUid(
        eventManager,
      );
    }

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.taxonomyService.getTaxonomies([
        ...new Set(taxonomy),
      ]);
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

  async deleteEvent(uid: string): Promise<EventDto> {
    const eventFromDb = await this.getEventByUid(uid);
    return new EventDto(await this.eventsRepo.remove(eventFromDb));
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

  async getTotal(params: FindOptionsWhere<Events>): Promise<number> {
    const query = this.eventsRepo
      .createQueryBuilder('events')
      .select('events.id');

    if (params && Object.keys(params).length) {
      query.where((builder) => this.andWhereCondition(builder, params));
    }

    return query.getCount();
  }

  async getArtists(artists: string[]): Promise<Artists[]> {
    const result = [];
    artists.forEach((artistUid) => {
      result.push(this.artistsService.getArtistByUid(artistUid));
    });

    return Promise.all(result);
  }

  andWhereCondition(
    builder: SelectQueryBuilder<Events>,
    filter: FindOptionsWhere<Events>,
  ) {
    return Object.entries(filter).forEach(([key, value]) => {
      const clearKey = key.replace(/[^a-zA-Z0-9]/g, '');

      if (typeof value === 'string') {
        builder.andWhere(`lower(events.${clearKey}) LIKE lower(:${clearKey})`, {
          [clearKey]: `%${value.trim()}%`,
        });
      } else if (Array.isArray(value)) {
        builder.andWhere(`events.${clearKey} IN (:...${clearKey})`, {
          [clearKey]: value,
        });
      }
    });
  }
}
