import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Orders } from './Orders';
import { Tickets } from './Tickets';

@Entity()
export class OrderItems {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Orders, (order) => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: Orders;

  @ManyToMany(() => Tickets, (ticket) => ticket.orderItems)
  ticket: Tickets;

  // todo: добавить ссылку на TicketSell для обратной связи заказа с конкретным периодом продажи билета

  @Column()
  price: number;

  @Column()
  service: number;

  @Column()
  discount: number;

  @Column()
  totalPrice: number;

  @Column()
  quantity: number;
}
