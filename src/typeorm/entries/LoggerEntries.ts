import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LoggerMessageType } from '../../utils/types/enums';

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

  @Column('varchar')
  status: string;

  @Column('varchar')
  message: string;

  @Column('text')
  request: string;

  @Column('text')
  headers: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createDateTime;
}
