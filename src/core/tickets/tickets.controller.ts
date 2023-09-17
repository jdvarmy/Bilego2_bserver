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
import { TicketsService } from './servises/tickets.service';
import { SaveTicketDto } from './dtos/save-ticket.dto';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { TicketDto } from './dtos/ticket.dto';
import { Routs } from '../../utils/types/enums';

@Controller(Routs.tickets)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get(':eventDateUid')
  getTickets(
    @Param('eventDateUid') eventDateUid: string,
  ): Promise<TicketDto[]> {
    return this.ticketsService.getTickets(eventDateUid);
  }

  @Post(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  saveTickets(
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    return this.ticketsService.saveTickets(eventDateUid, data);
  }

  @Put(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  editTickets(
    @Param('eventDateUid') eventDateUid: string,
    @Body() data: SaveTicketDto,
  ): Promise<TicketDto[]> {
    return this.ticketsService.saveTickets(eventDateUid, data);
  }

  @Delete(':eventDateUid')
  @UseGuards(AccessJwtAuthGuard)
  deleteTickets(@Body() ticketsUid: string[]): Promise<TicketDto[]> {
    return this.ticketsService.deleteTickets(ticketsUid);
  }
}
