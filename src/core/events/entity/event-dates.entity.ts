import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Events } from './events.entity';
import { Maps } from '../../map/entity/maps.entity';
import { Tickets } from '../../tickets/entity/tickets.entity';
import { TicketType } from '../../../utils/types/enums';

@Entity()
export class EventDates {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

  @ManyToOne(() => Events, (events) => events.eventDates, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  event: Events;

  @ManyToOne(() => Maps, (map) => map.eventDates, { onDelete: 'SET NULL' })
  @JoinColumn()
  map: Maps;

  @OneToMany(() => Tickets, (tickets) => tickets.eventDate)
  tickets: Tickets[];

  @Column({
    type: 'enum',
    enum: TicketType,
    default: null,
    nullable: true,
  })
  type: TicketType;

  @Column({ type: 'datetime', nullable: true })
  dateFrom: Date;

  @Column({ type: 'datetime', nullable: true })
  dateTo: Date;

  @Column({ type: 'datetime', nullable: true })
  closeDateTime: Date;
}
