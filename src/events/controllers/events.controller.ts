import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from '../services/events.service';
import { EditEventDto } from '../dtos/edit-event.dto';
import { EventDto } from '../dtos/event.dto';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { PostOptions } from '../../utils/types/types';
import { compareUid } from '../../utils/helpers/compareUid';
import { Routs } from '../../utils/types/enums';

@Controller(Routs.events)
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Get()
  getEventList(
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ) {
    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
    if (filter) {
      props.filter = filter;
    }

    return this.eventService.fetchEvents(props);
  }

  @Get(':uid')
  getEvent(@Param('uid') uid: string): Promise<EventDto> {
    return this.eventService.getEvent(uid);
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveEventTemplate(): Promise<EventDto> {
    return this.eventService.saveEventTemplate();
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  editEvent(
    @Param('uid') uid: string,
    @Body() eventDto: EditEventDto,
  ): Promise<EventDto> {
    compareUid(uid, eventDto.uid);
    return this.eventService.saveEvent(eventDto);
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteEvent(@Param('uid') uid: string): Promise<EventDto> {
    return this.eventService.deleteEvent(uid);
  }
}
