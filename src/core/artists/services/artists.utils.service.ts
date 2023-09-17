import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exception500 } from '../../../utils/types/enums';
import { Artists } from '../../../database/entity';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class ArtistsUtilsService {
  constructor(
    @InjectRepository(Artists)
    private readonly artistsRepo: Repository<Artists>,
  ) {}

  async getArtistByUid(
    uid: string,
    relations?: FindOptionsRelations<Artists>,
  ): Promise<Artists> {
    const artist = await this.artistsRepo.findOne({
      where: { uid },
      relations,
    });

    if (!artist) {
      throw new InternalServerErrorException(Exception500.findArtist);
    }

    return artist;
  }
}
