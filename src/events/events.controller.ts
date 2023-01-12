import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { City, SortType } from '../types/enums';
import { PutEventDto } from './request/PutEventDto';
import { EventDto } from './response/EventDto';
import { EventDates } from '../typeorm';
import { ReqEventDateDto } from './request/ReqEventDateDto';
import { EventDatesDto } from './response/EventDatesDto';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { PatchEventDto } from './request/PatchEventDto';

@Controller('v1/events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  // todo: refactor
  @Get()
  getFilteredEvents(
    @Query('city') city?: City,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('sort') sort?: SortType,
    @Query('weekends') weekends?: boolean,
    @Query('include') include?: string,
    @Query('exclude') exclude?: string,
  ) {
    const props: any = {
      city,
      offset: offset ?? 0,
      count: count ?? 10,
      sort: sort ?? SortType.asc,
      weekends: weekends ?? false,
    };
    if (include) {
      props.include = include;
    }
    if (exclude) {
      props.exclude = exclude;
    }

    return this.eventService.getFilteredEvents(props);
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
      this.eventService.checkEventUid(uid, eventDto.uid);

      return this.eventService.saveEvent(eventDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Patch(':uid')
  @UseGuards(AccessJwtAuthGuard)
  patchEvent(
    @Param('uid') uid: string,
    @Body() eventDto: PatchEventDto,
  ): Promise<EventDto> {
    try {
      this.eventService.checkEventUid(uid, eventDto.uid);

      return this.eventService.editEvent(eventDto);
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
  deleteEventDate(@Param('uid') uid: string): Promise<boolean> {
    try {
      return this.eventService.deleteEventDate(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':eventUid/dates')
  @UseGuards(AccessJwtAuthGuard)
  editEventDate(@Body() eventDateDto: ReqEventDateDto): Promise<EventDatesDto> {
    try {
      return this.eventService.editEventDate(eventDateDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
