import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDates, Events } from '../../typeorm';
import { Repository } from 'typeorm';
import { EventDto } from '../dtos/Event.dto';
import { v4 as uidv4 } from 'uuid';
import { Exception500 } from '../../utils/types/enums';
import { EditEventDto } from '../dtos/EditEvent.dto';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { ItemsUtilsService } from '../../items/services/items.utils.service';
import { EventDatesService } from './eventDates.service';
import { EventsUtilsService } from './events.utils.service';
import { DatabaseService } from '../../database/database.service';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { MedialibraryUtilsService } from '../../medialibrary/services/medialibrary.utils.service';
import { TaxonomyUtilsService } from '../../taxonomy/services/taxonomy.utils.service';
import { UsersUtilsService } from '../../users/services/users.utils.service';

const scope = 'events';

@Injectable()
export class EventsService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly itemsUtilsService: ItemsUtilsService,
    private readonly usersUtilsService: UsersUtilsService,
    private readonly taxonomyUtilsService: TaxonomyUtilsService,
    private readonly medialibraryUtilsService: MedialibraryUtilsService,

    @Inject(EventDatesService)
    private readonly eventDatesService: EventDatesService,

    @Inject(EventsUtilsService)
    private readonly eventsUtilsService: EventsUtilsService,

    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,

    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
  ) {}

  async fetchEvents(
    options: PostOptions,
  ): Promise<{ items: EventDto[]; props: ItemsPageProps }> {
    const query = await this.eventsRepo
      .createQueryBuilder(scope)
      .select([
        `${scope}.id`,
        `${scope}.uid`,
        `${scope}.status`,
        `${scope}.city`,
        `${scope}.title`,
        `${scope}.slug`,
        `${scope}.isShowOnSlider`,
        `${scope}.eventManager`,
        `${scope}.concertManagerPercentage`,
      ])
      .leftJoinAndSelect(`${scope}.eventDates`, 'dates')
      .leftJoinAndSelect(`${scope}.item`, 'item')
      .leftJoinAndSelect(`${scope}.artist`, 'artist')
      .leftJoinAndSelect(`${scope}.eventManager`, 'eventManager')
      .orderBy(`${scope}.id`, 'ASC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) =>
        this.databaseService.andWhereFilterCondition(
          builder,
          options.filter,
          scope,
        ),
      );
    }

    const events = await query.getMany();

    if (!events) {
      throw new InternalServerErrorException(Exception500.findEvents);
    }

    return {
      items: plainToClassResponse(EventDto, events),
      props: {
        total: await this.databaseService.getTotal(options.filter, scope),
      },
    };
  }

  async getEvent(uid: string) {
    const event = await this.eventsUtilsService.getEventByUid(uid, {
      item: true,
      artist: true,
      eventManager: true,
      eventDates: { map: true },
      taxonomy: true,
      headerImage: true,
      image: true,
    });

    return plainToClassResponse(EventDto, event);
  }

  async saveEventTemplate(): Promise<EventDto> {
    const uid = uidv4();

    const event = this.eventsRepo.create({
      uid,
      slug: `new-event-${+new Date()}`,
    });
    await this.eventsRepo.save(event);

    await this.eventDatesService.saveTemplateEventDate(event.uid);

    return plainToClassResponse(
      EventDto,
      await this.eventsUtilsService.getEventByUid(uid),
    );
  }

  async saveEvent(data: EditEventDto): Promise<EventDto> {
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

    const eventFromDb = await this.eventsUtilsService.getEventByUid(uid);
    const relations: Partial<Events> = {};

    // Обновляем площадку
    if (item) {
      relations['item'] = await this.itemsUtilsService.getItemByUid(item);
    }

    // Обновляем артистов
    if (artist) {
      relations['artists'] = await this.eventsUtilsService.getArtists(artist);
    }

    // Обновляем менеджера события
    if (eventManager) {
      relations['eventManager'] = await this.usersUtilsService.getUserByUid(
        eventManager,
      );
    }

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.taxonomyUtilsService.getTaxonomies([
        ...new Set(taxonomy),
      ]);
    }

    // Обновляем картинку события
    if (image) {
      relations['image'] = await this.medialibraryUtilsService.getMediaById(
        image,
      );
    }

    // Обновляем заголовок события
    if (headerImage) {
      relations['headerImage'] =
        await this.medialibraryUtilsService.getMediaById(headerImage);
    }

    // Обновляем даты проведения события
    if (eventDates) {
      for (const date of eventDates) {
        const { uid: dateUid, ...eventDateData } = date;
        const eventDateFromDb = await this.eventsUtilsService.getEventDateByUid(
          dateUid,
        );
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
    const eventFromDb = await this.eventsUtilsService.getEventByUid(uid);
    const event = await this.eventsRepo.remove(eventFromDb);

    return plainToClassResponse(EventDto, event);
  }
}
