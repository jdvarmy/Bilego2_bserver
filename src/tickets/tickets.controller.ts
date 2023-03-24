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
import { TicketsService } from './tickets.service';
import { SaveTicketDto } from './dtos/SaveTicket.dto';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { TicketDto } from './dtos/Ticket.dto';
import { Routs } from '../utils/types/enums';

@Controller(Routs.tickets)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  getTickets(
    @Param('eventDateUid') eventDateUid: string,
  ): Promise<TicketDto[]> {
    try {
      return this.ticketsService.getTickets(eventDateUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  saveTickets(
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    try {
      return this.ticketsService.saveTickets(eventDateUid, data);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  editTickets(
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    try {
      return this.ticketsService.saveTickets(eventDateUid, data);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  deleteTickets(@Body() ticketsUid: string[]): Promise<TicketDto[]> {
    try {
      return this.ticketsService.deleteTickets(ticketsUid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
