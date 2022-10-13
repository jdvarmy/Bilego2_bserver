import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostStatus } from '../types/enums';

export abstract class AbstractPost {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: 'enum', enum: PostStatus, default: PostStatus.temp })
  status: PostStatus;

  @Column({ nullable: true })
  title: string;

  @Column({ type: 'longtext', nullable: true })
  text: string;

  @CreateDateColumn()
  createDateTime: Date;

  @UpdateDateColumn()
  updateDateTime?: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
