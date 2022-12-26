import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonomyTypeLink, TaxonomyType } from '../types/enums';
import { Events } from './Events';
import { Items } from './Items';
import { Media } from './Media';

@Entity()
export class Taxonomy {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToMany(() => Events, (event) => event.taxonomy)
  @JoinTable()
  event: Events[];

  @ManyToMany(() => Items, (item) => item.taxonomy)
  @JoinTable()
  item: Items[];

  @Column({ type: 'enum', enum: TaxonomyTypeLink })
  link: TaxonomyTypeLink;

  @Column({ type: 'enum', enum: TaxonomyType })
  type: TaxonomyType;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => Media, (media) => media.taxonomyIcon, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  icon: Media;

  @ManyToOne(() => Media, (media) => media.taxonomyImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: Media;

  @Column({ nullable: true })
  sortNumber: number;

  @Column({ default: false })
  showInMenu: boolean;

  @Column({ default: false })
  showInMainPage: boolean;
}
