import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Events } from '../../events/entity/events.entity';
import { Items } from '../../items/entity/items.entity';
import { Artists } from '../../artists/entity/artists.entity';

@Entity()
export class SEO {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => Events, (event) => event.seo)
  event: Events;

  @OneToMany(() => Items, (item) => item.seo)
  item: Items;

  @OneToMany(() => Artists, (artist) => artist.seo)
  artist: Artists;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  author: string;
}
