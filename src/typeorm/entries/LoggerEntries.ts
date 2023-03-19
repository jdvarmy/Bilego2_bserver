import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoggerMessageType } from '../../types/enums';

@Entity()
export class LoggerEntries {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'enum',
    enum: LoggerMessageType,
    default: LoggerMessageType.log,
  })
  type: LoggerMessageType;

  @Column('varchar', { length: 50 })
  ip: string;

  @Column('varchar', { length: 255 })
  module: string;

  @Column('text')
  request: string;

  @Column('text')
  message: string;

  @Column('text')
  error: string;

  @CreateDateColumn()
  createDateTime;
}
