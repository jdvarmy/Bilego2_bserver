import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
} from '../typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uidv4 } from 'uuid';
import {
  City,
  PostStatus,
  UserEntityRole,
  UserEntityStatus,
} from '../types/enums';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(UserAccess)
    private userAccessRepo: Repository<UserAccess>,
    @InjectRepository(Events) private eventsRepo: Repository<Events>,
    @InjectRepository(EventDates)
    private eventDatesRepo: Repository<EventDates>,
    @InjectRepository(Items) private itemsRepo: Repository<Items>,
    @InjectRepository(ItemClosestMetro)
    private itemClosestMetroRepo: Repository<ItemClosestMetro>,
    @InjectRepository(Artists) private artistsRepo: Repository<Artists>,
    @InjectRepository(Maps) private mapsRepo: Repository<Maps>,
    @InjectRepository(Tickets) private ticketsRepo: Repository<Tickets>,
    @InjectRepository(TicketsSell)
    private ticketsSellRepo: Repository<TicketsSell>,
    @InjectRepository(SEO) private seoRepo: Repository<SEO>,
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Orders) private ordersRepo: Repository<Orders>,
    @InjectRepository(OrderItems)
    private orderItemsRepo: Repository<OrderItems>,
  ) {}

  async initial() {
    const admin = this.usersRepo.create({
      uid: uidv4(),
      email: 'chekist.87@mail.ru',
      login: 'chekist.87@mail.ru',
      pass: await bcrypt.hash('123', 13),
      role: UserEntityRole.admin,
      status: UserEntityStatus.active,
      name: 'Вася',
      surname: 'Пупкин',
      birthdate: new Date(),
      phone: '+7(999)227-72-27',
    });
    await this.usersRepo.save(admin);

    // items
    for (const i of [
      {
        uid: uidv4(),
        slug: 'dzhazovyj-parohod-dzhaz-kluba-kvadrat',
        status: PostStatus.publish,
        title: 'Джазовый пароход джаз-клуба Квадрат',
        text: 'this is club text',
        city: City.moscow,
      },
      {
        uid: uidv4(),
        slug: 'gostinica-oktjabrskaja',
        status: PostStatus.publish,
        title: 'Гостиница Октябрьская',
        text: 'this is club text',
        city: City.petersburg,
      },
      {
        uid: uidv4(),
        slug: 'dvorec-olimpija',
        status: PostStatus.publish,
        title: 'Дворец Олимпия',
        text: 'this is club text',
        city: City.petersburg,
      },
      {
        uid: uidv4(),
        slug: 'jfc-jazz-club',
        status: PostStatus.publish,
        title: 'JFC jazz club',
        text: 'this is club text',
        city: City.moscow,
      },
      {
        uid: uidv4(),
        slug: 'sevkabel-port',
        status: PostStatus.draft,
        title: 'Севкабель Порт',
        text: 'this is club text',
        city: City.petersburg,
      },
    ]) {
      const item = this.itemsRepo.create({
        uid: i.uid,
        slug: i.slug,
        status: i.status,
        title: i.title,
        text: i.text,
        city: i.city,
      });

      await this.itemsRepo.save(item);
    }
    // artists
    for (const i of [
      {
        uid: uidv4(),
        slug: 'holms',
        status: PostStatus.publish,
        title: 'Шерлок Холмс',
        text: 'this is artist text',
      },
      {
        uid: uidv4(),
        slug: 'ivanova',
        status: PostStatus.publish,
        title: 'Светлана Иванова',
        text: 'this is artist text',
      },
      {
        uid: uidv4(),
        slug: 'love',
        status: PostStatus.publish,
        title: 'Любовь Ескина',
        text: 'this is artist text',
      },
      {
        uid: uidv4(),
        slug: 'natalia',
        status: PostStatus.publish,
        title: 'Наталия Головлёва',
        text: 'this is artist text',
      },
      {
        uid: uidv4(),
        slug: 'lilia',
        status: PostStatus.draft,
        title: 'Лилия Борохович',
        text: 'this is artist text',
      },
    ]) {
      const item = this.artistsRepo.create({
        uid: i.uid,
        slug: i.slug,
        status: i.status,
        title: i.title,
        text: i.text,
      });

      await this.artistsRepo.save(item);
    }
  }
}
