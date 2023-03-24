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
import { EventsService } from '../services/events.service';
import { EditEventDto } from '../dtos/EditEvent.dto';
import { EventDto } from '../dtos/Event.dto';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { PostOptions } from '../../utils/types/types';
import { compareUid } from '../../utils/helpers/compareUid';
import { Routs } from '../../utils/types/enums';

@Controller(Routs.events)
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

      return this.eventService.fetchEvents(props);
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
    @Body() eventDto: EditEventDto,
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
}
