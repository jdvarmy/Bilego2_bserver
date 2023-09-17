import { Injectable } from '@nestjs/common';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EventDates,
  Events,
  ItemClosestMetro,
  Items,
  Artists,
  Maps,
  OrderItems,
  Orders,
  SEO,
  Taxonomy,
  Tickets,
  TicketsSell,
  UserAccess,
  Users,
  Media,
} from '../entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { PostStatus } from '../../utils/types/enums';

const eventScope = 'events';
const eventDateScope = 'dates';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Artists)
    private readonly artistsRepo: Repository<Artists>,
    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,
    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
    @InjectRepository(Items)
    private readonly itemsRepo: Repository<Items>,
    @InjectRepository(ItemClosestMetro)
    private readonly itemClosestMetroRepo: Repository<ItemClosestMetro>,
    @InjectRepository(Maps)
    private readonly mapsRepo: Repository<Maps>,
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
    @InjectRepository(Orders)
    private readonly ordersRepo: Repository<Orders>,
    @InjectRepository(OrderItems)
    private readonly orderItemsRepo: Repository<OrderItems>,
    @InjectRepository(SEO)
    private readonly seoRepo: Repository<SEO>,
    @InjectRepository(Taxonomy)
    private readonly taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Tickets)
    private readonly ticketsRepo: Repository<Tickets>,
    @InjectRepository(TicketsSell)
    private readonly ticketsSellRepo: Repository<TicketsSell>,
    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
    @InjectRepository(UserAccess)
    private readonly userAccessRepo: Repository<UserAccess>,
  ) {}

  // SERVER SCOPE

  public andWhereFilterCondition<T>(
    builder: SelectQueryBuilder<T>,
    filter: FindOptionsWhere<T>,
    tableName: string,
  ) {
    return Object.entries(filter).forEach(([key, value]) => {
      const clearKey = key.replace(/[^a-zA-Z0-9]/g, '');

      if (
        (typeof value === 'string' && ['true', 'false'].includes(value)) ||
        typeof value === 'boolean'
      ) {
        builder.andWhere(
          `lower(${tableName}.${clearKey}) = lower(:${clearKey})`,
          {
            [clearKey]:
              typeof value === 'boolean' ? +value : value === 'true' ? 1 : 0,
          },
        );
      } else if (typeof value === 'string') {
        builder.andWhere(
          `lower(${tableName}.${clearKey}) LIKE lower(:${clearKey})`,
          {
            [clearKey]: `%${value.trim()}%`,
          },
        );
      } else if (Array.isArray(value)) {
        builder.andWhere(`${tableName}.${clearKey} IN (:...${clearKey})`, {
          [clearKey]: value,
        });
      }
    });
  }

  public andWhereFutureEvents<T>(builder: SelectQueryBuilder<T>) {
    const currentTimestamp = Date.now();

    builder
      .andWhere(`${eventDateScope}.dateTo IS NOT NULL`)
      .andWhere(
        `UNIX_TIMESTAMP(${eventDateScope}.dateTo) * 1000 > ${currentTimestamp}`,
      )
      .andWhere(
        new Brackets((builder1) => {
          builder1
            .where(`${eventDateScope}.closeDateTime IS NULL`)
            .orWhere(
              `UNIX_TIMESTAMP(${eventDateScope}.closeDateTime) * 1000 > ${currentTimestamp}`,
            );
        }),
      );
  }

  public andWherePublishEvents<T>(builder: SelectQueryBuilder<T>) {
    builder.andWhere(`${eventScope}.status = :status`, {
      status: PostStatus.publish,
    });
  }

  public async getTotal<T>(
    params: FindOptionsWhere<T> | undefined,
    scope: string,
  ): Promise<number> {
    const query = this[`${scope}Repo`].createQueryBuilder(scope).select('id');

    if (params && Object.keys(params).length) {
      query.where((builder) =>
        this.andWhereFilterCondition(builder, params, scope),
      );
    }

    return query.getCount();
  }

  // CLIENT SCOPE

  public async getTotalForClientEvents<T>(
    params: FindOptionsWhere<T> | undefined,
    scope: string,
  ): Promise<number> {
    const query = this[`${scope}Repo`]
      .createQueryBuilder(scope)
      .select('id')
      .leftJoinAndSelect(`${scope}.eventDates`, 'dates');

    if (params && Object.keys(params).length) {
      query.where((builder) => {
        this.andWhereFilterCondition(builder, params, scope);

        this.andWhereFutureEvents(builder);
        this.andWherePublishEvents(builder);
      });
    }

    return query.getCount();
  }
}
