import { UserEntityRole, UserEntityStatus } from 'src/utils/types/enums';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserAccess } from './user-access.entity';
import { Orders } from '../../orders/entity/orders.entity';
import { Media } from '../../medialibrary/entity/media.entity';
import { Events } from '../../events/entity/events.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

  @OneToMany(() => UserAccess, (userAccess) => userAccess.user)
  userAccess: UserAccess[];

  @OneToMany(() => Events, (eventManager) => eventManager.eventManager)
  eventManager: Events[];

  @OneToMany(() => Orders, (orders) => orders.user)
  orders: Orders[];

  @Column({ length: 60, unique: true })
  email: string;

  @Column({ length: 60, unique: true })
  login: string;

  @Column({ length: 60 })
  pass: string;

  @Column({
    type: 'enum',
    enum: UserEntityRole,
    default: UserEntityRole.subscriber,
  })
  role: UserEntityRole;

  @Column({ default: UserEntityStatus.inactive })
  status: number;

  @ManyToOne(() => Media, (media) => media.userAvatar, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: Media;

  @Column({ length: 60, nullable: true })
  name: string;

  @Column({ length: 60, nullable: true })
  surname: string;

  @Column({ type: 'date', nullable: true })
  birthdate: Date;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  concertManagerInfo: string;

  @Column({ nullable: true })
  concertManagerPercentage: number;

  @CreateDateColumn()
  createDateTime: Date;

  @UpdateDateColumn()
  updateDateTime?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
