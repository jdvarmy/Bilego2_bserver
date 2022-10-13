import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from '../types/enums';
import { Events } from './Events';
import { Users } from './Users';
import { OrderItems } from './OrderItems';

@Entity()
export class Orders {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Events, (events) => events.orders, { onDelete: 'SET NULL' })
  @JoinColumn()
  event: Events;

  @ManyToOne(() => Users, (user) => user.orders, { onDelete: 'SET NULL' })
  @JoinColumn()
  user: Events;

  @OneToMany(() => OrderItems, (orderItems) => orderItems.order)
  orderItems: OrderItems[];

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.pendingPayment,
  })
  type: OrderStatus;

  @CreateDateColumn()
  createDateTime;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 0 })
  totalOrderPrice: number;
}
