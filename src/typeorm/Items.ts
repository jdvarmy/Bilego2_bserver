import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractPost } from './AbstractPost';
import { SEO } from './SEO';
import { Taxonomy } from './Taxonomy';
import { ItemClosestMetro } from './ItemClosestMetro';
import { Media } from './Media';
import { Events } from './Events';
import { City } from '../types/enums';

@Entity()
export class Items extends AbstractPost {
  @OneToMany(() => Events, (evet) => evet.item)
  event: Events[];

  @ManyToMany(() => Taxonomy, (taxonomy) => taxonomy.item)
  taxonomy: Taxonomy[];

  @ManyToOne(() => SEO, (seo) => seo.item, { onDelete: 'SET NULL' })
  @JoinColumn()
  seo: SEO;

  @OneToMany(
    () => ItemClosestMetro,
    (itemClosestMetro) => itemClosestMetro.item,
  )
  itemClosestMetro: ItemClosestMetro[];

  @ManyToOne(() => Media, (media) => media.itemImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: string;

  @Column({
    type: 'enum',
    enum: City,
    default: null,
    nullable: true,
  })
  city: City;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;
}
