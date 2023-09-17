import { Controller, Get, Query } from '@nestjs/common';
import { ArtistsService } from './services/artists.service';
import { ArtistDto } from './dtos/artist.dto';
import { Routs } from '../../utils/types/enums';
import { ItemsPageProps, PostOptions } from '../../utils/types/types';
import { AuthUser } from '../../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/user.dto';

@Controller(Routs.artists)
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  getArtistList(
    @AuthUser() user: UserDto,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: ArtistDto[]; props: ItemsPageProps }> {
    const props: PostOptions = {
      offset: offset ?? 0,
      count: count ?? 20,
    };
    if (filter) {
      props.filter = filter;
    }

    return this.artistsService.fetchArtists(props);
  }
}
