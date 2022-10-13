import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Events } from './Events';
import { Items } from './Items';
import { Artists } from './Artists';

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
