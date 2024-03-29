import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonomyTypeLink, TaxonomyType } from '../../../utils/types/enums';
import { Events } from '../../events/entity/events.entity';
import { Items } from '../../items/entity/items.entity';
import { Media } from '../../medialibrary/entity/media.entity';

@Entity()
export class Taxonomy {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 60, unique: true })
  uid: string;

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
  overIndex: number;

  @Column({ default: false })
  showInMenu: boolean;

  @Column({ default: false })
  showInMainPage: boolean;
}
