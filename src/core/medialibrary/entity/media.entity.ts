import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from '../../users/entity/users.entity';
import { Artists } from '../../artists/entity/artists.entity';
import { Items } from '../../items/entity/items.entity';
import { Events } from '../../events/entity/events.entity';
import { Maps } from '../../map/entity/maps.entity';
import { Taxonomy } from '../../taxonomy/entity/taxonomy.entity';

@Entity()
export class Media {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @OneToMany(() => Maps, (map) => map.map)
  mapFile: Maps[];
  @OneToMany(() => Maps, (minimap) => minimap.minimap)
  minimapFile: Maps[];

  @OneToMany(() => Users, (user) => user.avatar)
  userAvatar: Users[];

  @OneToMany(() => Artists, (artist) => artist.image)
  artistImage: Artists[];
  @OneToMany(() => Artists, (artist) => artist.avatar)
  artistAvatar: Artists[];

  @OneToMany(() => Items, (item) => item.image)
  itemImage: Items[];
  @OneToMany(() => Items, (item) => item.headerImage)
  itemHeaderImage: Items[];

  @OneToMany(() => Events, (event) => event.image)
  eventImage: Events[];
  @OneToMany(() => Events, (event) => event.headerImage)
  eventHeaderImage: Events[];

  @OneToMany(() => Taxonomy, (taxonomy) => taxonomy.icon)
  taxonomyIcon: Taxonomy[];
  @OneToMany(() => Taxonomy, (taxonomy) => taxonomy.image)
  taxonomyImage: Taxonomy[];

  @Column({ default: '' })
  name: string;

  @Column()
  originalName: string;

  @Column({ type: 'longtext' })
  path: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column({ type: 'longtext', nullable: true })
  s3location: string;

  @Column({ type: 'longtext', nullable: true })
  s3key: string;
}
