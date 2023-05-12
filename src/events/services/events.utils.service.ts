import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Artists, EventDates, Events } from '../../database/entity';
import { Exception500 } from '../../utils/types/enums';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistsUtilsService } from '../../artists/services/artists.utils.service';

@Injectable()
export class EventsUtilsService {
  constructor(
    private readonly artistsUtilsService: ArtistsUtilsService,

    @InjectRepository(Events)
    private readonly eventsRepo: Repository<Events>,

    @InjectRepository(EventDates)
    private readonly eventDatesRepo: Repository<EventDates>,
  ) {}

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
      result.push(this.artistsUtilsService.getArtistByUid(artistUid));
    });

    return Promise.all(result);
  }
}
