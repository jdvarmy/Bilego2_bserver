import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artists } from './Artists';
import { AbstractPost } from './AbstractPost';
import { EventDates } from './EventDates';
import { SEO } from './SEO';
import { Taxonomy } from './Taxonomy';
import { Orders } from './Orders';
import { City, EventHeaderType } from '../types/enums';
import { Users } from './Users';
import { Media } from './Media';
import { Items } from './Items';

@Entity()
export class Events extends AbstractPost {
  @ManyToMany(() => Artists, (artists) => artists.event)
  @JoinTable()
  artist: Artists;

  @ManyToOne(() => Items, (item) => item.event, { onDelete: 'SET NULL' })
  @JoinColumn()
  item: Items;

  @Column({
    type: 'enum',
    enum: City,
    default: null,
    nullable: true,
  })
  city: City;

  @ManyToOne(() => SEO, (seo) => seo.event, { onDelete: 'SET NULL' })
  @JoinColumn()
  seo: SEO;

  @ManyToOne(() => Users, (users) => users.eventManager, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  eventManager: Users;

  @ManyToMany(() => Taxonomy, (taxonomy) => taxonomy.event)
  taxonomy: Taxonomy[];

  @OneToMany(() => EventDates, (eventDates) => eventDates.event)
  eventDates: EventDates[];

  // todo: непонятно пока куда сувать ордера, к событию или к дате события
  @OneToMany(() => Orders, (orders) => orders.event)
  orders: Orders[];

  @ManyToOne(() => Media, (media) => media.eventImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: Media;

  @Column({ type: 'text', nullable: true })
  fragment: string;

  @Column({ type: 'text', nullable: true })
  searchWords: string;

  @Column({ nullable: true })
  ageRestriction: number;

  @Column({ default: false })
  isShowOnSlider: boolean;

  @Column({ nullable: true })
  musicLink: string;

  @Column({ nullable: true })
  videoLink: string;

  @Column({
    type: 'enum',
    enum: EventHeaderType,
    default: EventHeaderType.image,
  })
  headerType: EventHeaderType;

  @ManyToOne(() => Media, (media) => media.eventHeaderImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  headerImage: Media;

  @Column({ nullable: true })
  headerMedia: string;

  @Column({
    nullable: true,
    default: JSON.stringify({ title: '', subtitle: '', meta: '' }),
  })
  headerText: string;

  @Column({
    nullable: true,
    default: JSON.stringify({
      title: 'rgba(255, 255, 255, 1)',
      subtitle: 'rgba(255, 255, 255, 1)',
      meta: 'rgba(255, 255, 255, 1)',
    }),
  })
  headerTextColor: string;

  @Column({ type: 'text', nullable: true })
  concertManagerInfo: string;

  @Column({ nullable: true })
  concertManagerPercentage: number;
}
