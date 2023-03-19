import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Media } from '../../typeorm';
import { Exception500 } from '../../types/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedialibraryUtilsService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepo: Repository<Media>,
  ) {}

  async getMediaById(
    id?: number,
    relations?: FindOptionsRelations<Media>,
  ): Promise<Media> {
    if (!id) return;

    const media = await this.mediaRepo.findOne({
      where: { id },
      relations,
    });

    if (!media) {
      throw new InternalServerErrorException(Exception500.findMedia);
    }

    return media;
  }
}
