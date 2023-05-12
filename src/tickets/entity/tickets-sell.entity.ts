import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Tickets } from './tickets.entity';

@Entity()
export class TicketsSell {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

  @ManyToMany(() => Tickets, (tickets) => tickets.ticketsSell)
  tickets: Tickets[];

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  service: number;

  @Column({ type: 'datetime', nullable: true })
  dateFrom: string;

  @Column({ type: 'datetime', nullable: true })
  dateTo: string;

  @Column({ nullable: true })
  color: string;

  @CreateDateColumn()
  createDateTime: Date;

  @UpdateDateColumn()
  updateDateTime?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
