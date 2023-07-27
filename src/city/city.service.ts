import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../database/servises/database.service';
import { MedialibraryUtilsService } from '../medialibrary/services/medialibrary.utils.service';
import { PostOptions } from '../utils/types/types';
import { PostStatus } from '../utils/types/enums';
import { plainToClassResponse } from '../utils/helpers/plainToClassResponse';
import { EventDto } from '../events/dtos/event.dto';
import { EventDates, Events } from '../database/entity';
import { Repository } from 'typeorm';

const eventScope = 'events';
const eventDateScope = 'dates';
const mediaScope = 'media';

@Injectable()
export class CityService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly medialibraryUtilsService: MedialibraryUtilsService,

    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,

    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
  ) {}

  async fetchHomeEvents(options: PostOptions) {
    const query = await this.eventsRepo
      .createQueryBuilder(eventScope)
      .select([
        `${eventScope}.id`,
        `${eventScope}.uid`,
        `${eventScope}.title`,
        `${eventScope}.slug`,
      ])
      .leftJoinAndSelect(`${eventScope}.eventDates`, eventDateScope)
      .leftJoinAndSelect(`${eventScope}.headerImage`, mediaScope)
      .orderBy(`${eventScope}.id`, 'DESC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) =>
        this.databaseService.andWhereFilterCondition(
          builder,
          options.filter,
          eventScope,
        ),
      );
    }

    query.andWhere(`${eventScope}.status = :status`, {
      status: PostStatus.publish,
    });

    const events = await query.getMany();

    return {
      items: plainToClassResponse(EventDto, events),
      props: {
        total: await this.databaseService.getTotal(options.filter, eventScope),
      },
    };
  }
}
