import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SaveTicketDto } from '../dtos/SaveTicket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EventDates, Tickets, TicketsSell } from '../../database/entity';
import { Repository } from 'typeorm';
import { TicketDto } from '../dtos/Ticket.dto';
import { Exception500 } from '../../utils/types/enums';
import { TicketSellDto } from '../dtos/TicketSell.dto';
import { EventsUtilsService } from '../../events/services/events.utils.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly eventsUtilsService: EventsUtilsService,
    @InjectRepository(Tickets) private ticketsRepo: Repository<Tickets>,
    @InjectRepository(TicketsSell)
    private ticketsSellRepo: Repository<TicketsSell>,
  ) {}

  async getTickets(dateUid: string): Promise<TicketDto[]> {
    const eventDate = await this.eventsUtilsService.getEventDateByUid(dateUid);

    return this.getEventTicketsDto(eventDate.id);
  }

  async saveTickets(
    dateUid: string,
    { tickets, sell }: SaveTicketDto,
  ): Promise<TicketDto[]> {
    const eventDate = await this.eventsUtilsService.getEventDateByUid(dateUid);

    const repoSell: TicketsSell[] = [];
    for (const _sell of sell) {
      const sellFromDb = await this.getSellByUid(_sell.uid);

      if (sellFromDb) {
        repoSell.push(await this.saveSell({ ...sellFromDb, ..._sell }));
      } else {
        repoSell.push(await this.saveSell(_sell));
      }
    }

    for (const _ticket of tickets) {
      const ticketFromDb = await this.getTicketByUid(_ticket.uid);

      if (ticketFromDb) {
        await this.saveTicket(
          eventDate,
          { ...ticketFromDb, ..._ticket },
          repoSell,
        );
      } else {
        await this.saveTicket(eventDate, _ticket, repoSell);
      }
    }

    // удаляем лишние записи в таблице TicketSell
    this.deleteTicketSell();

    return this.getEventTicketsDto(eventDate.id);
  }

  async deleteTickets(ticketsUid: string[]): Promise<TicketDto[]> {
    const deleted: Tickets[] = [];
    for (const uid of ticketsUid) {
      const ticket = await this.getTicketByUid(uid);
      deleted.push(await this.ticketsRepo.remove(ticket));
    }

    return deleted.map((t) => new TicketDto(t));
  }

  // UTILS
  async getEventTicketsByDateId(id: number): Promise<Tickets[]> {
    const tickets = await this.ticketsRepo
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.ticketsSell', 'sell')
      .where('tickets.eventDate = :eventDate', { eventDate: id })
      .orderBy('tickets.id', 'ASC')
      .addOrderBy('sell.id', 'ASC')
      .getMany();

    if (!tickets) {
      return [] as Tickets[];
    }

    return tickets;
  }

  async getEventTicketsDto(eventDateId: number): Promise<TicketDto[]> {
    return (await this.getEventTicketsByDateId(eventDateId)).map(
      (t) => new TicketDto(t),
    );
  }

  async getTicketByUid(uid: string, error = false): Promise<Tickets | null> {
    const ticket = await this.ticketsRepo
      .createQueryBuilder('tickets')
      .leftJoinAndSelect('tickets.ticketsSell', 'sell')
      .where('tickets.uid = :uid', { uid })
      .getOne();

    if (error && !ticket) {
      throw new InternalServerErrorException(Exception500.findTickets);
    }

    return ticket;
  }

  async getSellByUid(uid: string, error = false): Promise<TicketsSell | null> {
    const sell = await this.ticketsSellRepo
      .createQueryBuilder('sell')
      .leftJoinAndSelect('sell.tickets', 'tickets')
      .where('sell.uid = :uid', { uid })
      .getOne();

    if (error && !sell) {
      throw new InternalServerErrorException(Exception500.findSell);
    }

    return sell;
  }

  async saveTicket(
    eventDate: EventDates,
    ticket: TicketDto,
    repoSell: TicketsSell[],
  ): Promise<Tickets> {
    const repoTicket = this.ticketsRepo.create({
      ...ticket,
      eventDate,
      ticketsSell: repoSell,
    });
    await this.ticketsRepo.save(repoTicket);

    return repoTicket;
  }

  async saveSell(sell: TicketSellDto): Promise<TicketsSell> {
    const repo = await this.ticketsSellRepo.create({ ...sell });
    return this.ticketsSellRepo.save(repo);
  }

  async deleteTicketSell(): Promise<void> {
    // todo: посмотреть со временем будут ли в связывающей таблице "брошенные" sell записи, уже провел анализ, нужна реализация
  }
}
