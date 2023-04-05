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
  UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { SaveTicketDto } from './dtos/SaveTicket.dto';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { TicketDto } from './dtos/Ticket.dto';
import { Routs } from '../utils/types/enums';
import { DataLoggerService } from '../logger/data.logger.service';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';

@Controller(Routs.tickets)
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  getTickets(
    @AuthUser() user: UserDto,
    @Param('eventDateUid') eventDateUid: string,
  ): Promise<TicketDto[]> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} запросил список билетов`,
      );

      return this.ticketsService.getTickets(eventDateUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  saveTickets(
    @AuthUser() user: UserDto,
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    try {
      this.dataLoggerService.dbLog(
        `User ${
          user.email ?? user.uid
        } добавил билеты к дате события ${eventDateUid}`,
        [HttpStatus.CREATED, 'Created'],
      );
      return this.ticketsService.saveTickets(eventDateUid, data);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  async editTickets(
    @AuthUser() user: UserDto,
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    try {
      this.dataLoggerService.dbLog(
        `User ${
          user.email ?? user.uid
        } отредактировал билеты у даты события ${eventDateUid}`,
      );
      return this.ticketsService.saveTickets(eventDateUid, data);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  deleteTickets(
    @AuthUser() user: UserDto,
    @Body() ticketsUid: string[],
  ): Promise<TicketDto[]> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} удалил билеты`,
      );
      return this.ticketsService.deleteTickets(ticketsUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
