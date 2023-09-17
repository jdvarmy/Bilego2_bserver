import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DatabaseService } from '../../../database/servises/database.service';
import { MedialibraryUtilsService } from '../../medialibrary/services/medialibrary.utils.service';
import { PostOptions } from '../../../utils/types/types';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';
import { EventDates, Events } from '../../../database/entity';
import { Repository } from 'typeorm';
import { SliderDto } from '../dtos/slider.dto';

const eventScope = 'events';
const itemScope = 'items';
const eventDateScope = 'dates';
const mediaScope = 'media';
const taxonomyScope = 'taxonomy';

@Injectable()
export class SliderService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly medialibraryUtilsService: MedialibraryUtilsService,

    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,

    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
  ) {}

  async getSliderList(options: PostOptions): Promise<SliderDto[]> {
    const query = this.eventsRepo
      .createQueryBuilder(eventScope)
      .select([
        `${eventScope}.id`,
        `${eventScope}.uid`,
        `${eventScope}.title`,
        `${eventScope}.slug`,
        `${eventScope}.ageRestriction`,
        `${eventScope}.fragment`,
      ])
      .leftJoinAndSelect(`${eventScope}.eventDates`, eventDateScope)
      .leftJoinAndSelect(`${eventScope}.item`, itemScope)
      .leftJoinAndSelect(`${eventScope}.image`, mediaScope)
      .leftJoinAndSelect(`${eventScope}.taxonomy`, taxonomyScope)
      .orderBy(`${eventScope}.id`, 'DESC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) => {
        this.databaseService.andWhereFilterCondition(
          builder,
          options.filter,
          eventScope,
        );

        this.databaseService.andWhereFutureEvents(builder);
        this.databaseService.andWherePublishEvents(builder);
        builder.andWhere(`${eventScope}.isShowOnSlider = 1`);
      });
    }

    const events = await query.getMany();

    return plainToClassResponse(SliderDto, events);
  }
}
