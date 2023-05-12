import { Entity, JoinColumn, ManyToMany, ManyToOne } from 'typeorm';
import { AbstractPost } from '../../database/entity/abstract-post.entity';
import { Events } from '../../events/entity/events.entity';
import { SEO } from '../../database/entity/seo.entity';
import { Media } from '../../medialibrary/entity/media.entity';

@Entity()
export class Artists extends AbstractPost {
  @ManyToMany(() => Events, (event) => event.artist)
  event: Events;

  @ManyToOne(() => SEO, (seo) => seo.artist, { onDelete: 'SET NULL' })
  @JoinColumn()
  seo: SEO;

  @ManyToOne(() => Media, (media) => media.artistImage, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  image: Media;

  @ManyToOne(() => Media, (media) => media.artistAvatar, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  avatar: Media;
}
