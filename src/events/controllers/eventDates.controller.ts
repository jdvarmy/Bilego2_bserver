import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Routs } from '../../utils/types/enums';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { EventDates } from '../../database/entity';
import { EventDatesDto } from '../dtos/event-dates.dto';
import { EditEventDateDto } from '../dtos/edit-event-date.dto';
import { compareUid } from '../../utils/helpers/compareUid';
import { EventDatesService } from '../services/eventDates.service';

@Controller(Routs.events)
export class EventDatesController {
  constructor(private readonly eventDatsService: EventDatesService) {}

  @Get(':eventUid/dates')
  @UseGuards(AccessJwtAuthGuard)
  getEventDates(@Param('eventUid') eventUid: string): Promise<EventDates[]> {
    return this.eventDatsService.getEventDates(eventUid);
  }

  @Post(':eventUid/dates')
  @UseGuards(AccessJwtAuthGuard)
  saveEventDate(@Param('eventUid') eventUid: string): Promise<EventDatesDto> {
    return this.eventDatsService.saveTemplateEventDate(eventUid);
  }

  @Delete(':eventUid/dates/:uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteEventDate(@Param('uid') uid: string): Promise<EventDatesDto> {
    return this.eventDatsService.deleteEventDate(uid);
  }

  @Put(':eventUid/dates/:uid')
  @UseGuards(AccessJwtAuthGuard)
  editEventDate(
    @Param('uid') uid: string,
    @Body() eventDateDto: EditEventDateDto,
  ): Promise<EventDatesDto> {
    compareUid(uid, eventDateDto.uid);

    return this.eventDatsService.editEventDate(eventDateDto);
  }
}
