import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { PutEventDto } from './request/PutEventDto';
import { EventDto } from './response/EventDto';
import { EventDates } from '../typeorm';
import { ReqEventDateDto } from './request/ReqEventDateDto';
import { EventDatesDto } from './response/EventDatesDto';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { PostOptions } from '../types/types';
import { compareUid } from '../helpers/compareUid';
import { Version } from '../types/enums';

@Controller(`${Version._1}events`)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getEventList(
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ) {
    try {
      const props: PostOptions = {
        offset: offset ?? 0,
        count: count ?? 20,
      };
      if (filter) {
        props.filter = filter;
      }

      return this.eventService.getEventList(props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  getEvent(@Param('uid') uid: string): Promise<EventDto> {
    try {
      return this.eventService.getEvent(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveEventTemplate(): Promise<EventDto> {
    try {
      return this.eventService.saveEventTemplate();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  editEvent(
    @Param('uid') uid: string,
    @Body() eventDto: PutEventDto,
  ): Promise<EventDto> {
    try {
      compareUid(uid, eventDto.uid);

      return this.eventService.saveEvent(eventDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteEvent(@Param('uid') uid: string): Promise<EventDto> {
    try {
      return this.eventService.deleteEvent(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':eventUid/dates')
  @UseGuards(AccessJwtAuthGuard)
  getEventDates(@Param('eventUid') eventUid: string): Promise<EventDates[]> {
    try {
      return this.eventService.getEventDates(eventUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post(':eventUid/dates')
  @UseGuards(AccessJwtAuthGuard)
  saveEventDate(@Param('eventUid') eventUid: string): Promise<EventDatesDto> {
    try {
      return this.eventService.saveTemplateEventDate(eventUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':eventUid/dates/:uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteEventDate(@Param('uid') uid: string): Promise<EventDatesDto> {
    try {
      return this.eventService.deleteEventDate(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':eventUid/dates/:uid')
  @UseGuards(AccessJwtAuthGuard)
  editEventDate(
    @Param('uid') uid: string,
    @Body() eventDateDto: ReqEventDateDto,
  ): Promise<EventDatesDto> {
    try {
      compareUid(uid, eventDateDto.uid);

      return this.eventService.editEventDate(eventDateDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
