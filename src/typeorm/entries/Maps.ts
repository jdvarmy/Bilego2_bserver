import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventDates } from './EventDates';
import { Media } from './Media';

@Entity()
export class Maps {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

  @OneToMany(() => EventDates, (eventDates) => eventDates.map)
  eventDates: EventDates[];

  @ManyToOne(() => Media, (media) => media.mapFile, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  map: Media;

  @ManyToOne(() => Media, (media) => media.minimapFile, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  minimap: Media;

  @Column({ nullable: true })
  xml: string;

  @Column({ nullable: true })
  viewBox: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ type: 'longtext', nullable: true })
  background: string;

  @Column({ type: 'longtext', nullable: true })
  attributes: string;

  @Column({ type: 'longtext', nullable: true })
  metadata: string;

  @Column({ type: 'longtext', nullable: true })
  paths: string;

  @Column({ type: 'longtext', nullable: true })
  seats: string;
}
