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

  @Column('varchar', { length: 50, nullable: true })
  ip: string;

  @Column('varchar', { nullable: true })
  status: string;

  @Column('varchar', { nullable: true })
  context: string;

  @Column('varchar', { nullable: true })
  message: string;

  @Column('text', { nullable: true })
  request: string;

  @Column('text', { nullable: true })
  headers: string;

  @Column('text', { nullable: true })
  body: string;

  @CreateDateColumn()
  createDateTime;
}
