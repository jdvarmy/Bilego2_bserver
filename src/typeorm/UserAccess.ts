import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './Users';

@Entity()
export class UserAccess {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Users, (users) => users.userAccess, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: Users;

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ length: 20 })
  ip: string;

  @Column({ nullable: true })
  device: string;

  @CreateDateColumn()
  createDateTime;

  @UpdateDateColumn()
  updateDateTime;
}
