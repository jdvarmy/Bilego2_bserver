import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exception500, PostStatus } from '../types/enums';
import { Artists } from '../typeorm';
import { ArtistDto } from '../dtos/ArtistDto';

@Injectable()
export class ArtistsService {
  constructor(
    @InjectRepository(Artists) private artistsRepo: Repository<Artists>,
  ) {}

  async getArtistList(search: string): Promise<ArtistDto[]> {
    const artists = await this.artistsRepo
      .createQueryBuilder('artists')
      .select(['artists.uid', 'artists.title'])
      .where(
        'lower(artists.title) LIKE lower(:search) AND artists.status = :status',
        {
          search: `%${search}%`,
          status: PostStatus.publish,
        },
      )
      .orderBy('artists.title', 'ASC')
      .getMany();

    if (!artists) {
      throw new InternalServerErrorException(Exception500.findItems);
    }

    return artists.map((artist) => new ArtistDto(artist));
  }
}
