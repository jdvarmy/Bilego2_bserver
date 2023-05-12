import { Module } from '@nestjs/common';
import { TicketsService } from './servises/tickets.service';
import { TicketsController } from './tickets.controller';
import { DatabaseModule } from '../database/database.module';
import { EventsModule } from '../events/events.module';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [DatabaseModule, EventsModule, DataLoggerModule],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
