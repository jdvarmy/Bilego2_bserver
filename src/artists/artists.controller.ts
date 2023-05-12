import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ArtistsService } from './services/artists.service';
import { ArtistDto } from './dtos/Artist.dto';
import { Routs } from '../utils/types/enums';
import { ItemsPageProps, PostOptions } from '../utils/types/types';
import { DataLoggerService } from '../logger/data.logger.service';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';

@Controller(Routs.artists)
export class ArtistsController {
  constructor(
    private readonly artistsService: ArtistsService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  getArtistList(
    @AuthUser() user: UserDto,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: ArtistDto[]; props: ItemsPageProps }> {
    try {
      const props: PostOptions = {
        offset: offset ?? 0,
        count: count ?? 20,
      };
      if (filter) {
        props.filter = filter;
      }

      return this.artistsService.fetchArtists(props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
