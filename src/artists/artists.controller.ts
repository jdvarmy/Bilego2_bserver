import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistDto } from '../dtos/ArtistDto';

@Controller('v1/artists')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get()
  getArtistList(@Query('search') search: string): Promise<ArtistDto[]> {
    try {
      return this.artistsService.getArtistList(search);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
