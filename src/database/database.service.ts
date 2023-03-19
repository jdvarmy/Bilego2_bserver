import { Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
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
  Session,
  LoggerEntries,
} from '../typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Artists) private artistsRepo: Repository<Artists>,
    @InjectRepository(Events) private eventsRepo: Repository<Events>,
    @InjectRepository(EventDates)
    private eventDatesRepo: Repository<EventDates>,
    @InjectRepository(Items) private itemsRepo: Repository<Items>,
    @InjectRepository(ItemClosestMetro)
    private itemClosestMetroRepo: Repository<ItemClosestMetro>,
    @InjectRepository(LoggerEntries)
    private loggerEntriesRepo: Repository<LoggerEntries>,
    @InjectRepository(Maps) private mapsRepo: Repository<Maps>,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    @InjectRepository(Orders) private ordersRepo: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemsRepo: Repository<OrderItems>,
    @InjectRepository(SEO) private seoRepo: Repository<SEO>,
    @InjectRepository(Session) private sessionRepo: Repository<Session>,
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Tickets) private ticketsRepo: Repository<Tickets>,
    @InjectRepository(TicketsSell)
    private ticketsSellRepo: Repository<TicketsSell>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(UserAccess)
    private userAccessRepo: Repository<UserAccess>,
  ) {}

  andWhereFilterCondition<T>(
    builder: SelectQueryBuilder<T>,
    filter: FindOptionsWhere<T>,
    tableName: string,
  ) {
    return Object.entries(filter).forEach(([key, value]) => {
      const clearKey = key.replace(/[^a-zA-Z0-9]/g, '');

      if (typeof value === 'string') {
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

  async getTotal<T>(
    params: FindOptionsWhere<T>,
    scope: string,
  ): Promise<number> {
    const query = this[`${scope}Repo`].createQueryBuilder().select('id');

    if (params && Object.keys(params).length) {
      query.where((builder) =>
        this.andWhereFilterCondition(builder, params, scope),
      );
    }

    return query.getCount();
  }
}
