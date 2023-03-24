import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exception500 } from '../../utils/types/enums';
import { Artists } from '../../typeorm';
import { ArtistDto } from '../dtos/Artist.dto';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { DatabaseService } from '../../database/database.service';
import { ArtistsUtilsService } from './artists.utils.service';

const scope = 'artists';

@Injectable()
export class ArtistsService {
  constructor(
    private readonly databaseService: DatabaseService,

    @Inject(ArtistsUtilsService)
    private readonly artistsUtilsService: ArtistsUtilsService,

    @InjectRepository(Artists)
    private readonly artistsRepo: Repository<Artists>,
  ) {}

  async fetchArtists(
    options: PostOptions,
  ): Promise<{ items: ArtistDto[]; props: ItemsPageProps }> {
    const query = this.artistsRepo
      .createQueryBuilder(scope)
      .select([
        `${scope}.uid`,
        `${scope}.status`,
        `${scope}.slug`,
        `${scope}.title`,
        `${scope}.city`,
      ])
      .orderBy(`${scope}.id`, 'ASC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) =>
        this.databaseService.andWhereFilterCondition(
          builder,
          options.filter,
          scope,
        ),
      );
    }

    const artists = await query.getMany();

    if (!artists) {
      throw new InternalServerErrorException(Exception500.findItems);
    }

    return {
      items: plainToClassResponse(ArtistDto, artists),
      props: {
        total: await this.databaseService.getTotal(options.filter, scope),
      },
    };
  }
}
