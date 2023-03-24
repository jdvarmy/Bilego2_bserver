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
import { City } from '../../utils/types/enums';

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
  image: Media;

  @ManyToOne(() => Media, (media) => media.itemHeaderImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  headerImage: Media;

  @Column({
    type: 'enum',
    enum: City,
    default: null,
    nullable: true,
  })
  city: City;

  @Column({ type: 'text', nullable: true })
  fragment: string;

  @Column({ type: 'text', nullable: true })
  searchWords: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  latitude: string;

  @Column({ nullable: true })
  longitude: string;
}
