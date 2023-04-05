import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { AuthUser } from '../../utils/decorators/AuthUser';
import { UserDto } from '../../users/dtos/User.dto';
import { DataLoggerService } from '../../logger/data.logger.service';

@Controller(Routs.events)
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getEventList(
    @AuthUser() user: UserDto,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ) {
    try {
      const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
      if (filter) {
        props.filter = filter;
      }

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} запросил список событий`,
      );

      return this.eventService.fetchEvents(props);
    } catch (e) {
      throw new InternalServerErrorException(e.messagemessagemessage);
    }
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  getEvent(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<EventDto> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} запросил событие ${uid}`,
      );

      return this.eventService.getEvent(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.messagemessagemessage);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  async saveEventTemplate(@AuthUser() user: UserDto): Promise<EventDto> {
    try {
      const template = await this.eventService.saveEventTemplate();
      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} создал шаблон события ${template.uid}`,
        [HttpStatus.CREATED, 'Created'],
      );
      return template;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async editEvent(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
    @Body() eventDto: EditEventDto,
  ): Promise<EventDto> {
    try {
      compareUid(uid, eventDto.uid);
      const event = await this.eventService.saveEvent(eventDto);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} отредактировал событие ${event.uid}`,
      );

      return event;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async deleteEvent(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<EventDto> {
    try {
      const event = await this.eventService.deleteEvent(uid);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} удалил событие ${
          event.title ?? event.uid
        }`,
      );

      return event;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
