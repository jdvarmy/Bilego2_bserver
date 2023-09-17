import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artists } from '../../artists/entity/artists.entity';
import { AbstractPost } from '../../../database/entity/abstract-post.entity';
import { EventDates } from './event-dates.entity';
import { SEO } from '../../../database/entity/seo.entity';
import { Taxonomy } from '../../taxonomy/entity/taxonomy.entity';
import { Orders } from '../../orders/entity/orders.entity';
import { City, EventHeaderType } from '../../../utils/types/enums';
import { Users } from '../../users/entity/users.entity';
import { Media } from '../../medialibrary/entity/media.entity';
import { Items } from '../../items/entity/items.entity';

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
      title: '#ffffff',
      subtitle: '#ffffff',
      meta: '#ffffff',
    }),
  })
  headerTextColor: string;

  @Column({ type: 'text', nullable: true })
  concertManagerInfo: string;

  @Column({ nullable: true })
  concertManagerPercentage: number;
}
