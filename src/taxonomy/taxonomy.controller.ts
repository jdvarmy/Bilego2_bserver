import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaxonomyService } from './services/taxonomy.service';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { TaxonomyDto } from './dtos/taxonomy.dto';
import { Routs, TaxonomyType, TaxonomyTypeLink } from '../utils/types/enums';
import { SaveTaxonomyDto } from './dtos/save-taxonomy.dto';
import { ItemsPageProps, PostOptions } from '../utils/types/types';
import { EditTaxonomyDto } from './dtos/edit-taxonomy.dto';

@Controller(Routs.taxonomy)
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get([':link', ':link/:type'])
  getTaxonomyListByType(
    @Param('link') link: TaxonomyTypeLink,
    @Param('type') type?: TaxonomyType,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: TaxonomyDto[]; props: ItemsPageProps }> {
    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
    if (filter) {
      props.filter = filter;
    }

    return this.taxonomyService.getTaxonomyList(link, props);
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveTaxonomy(@Body() taxonomyDto: SaveTaxonomyDto): Promise<TaxonomyDto> {
    return this.taxonomyService.saveTaxonomy(taxonomyDto);
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  putTaxonomy(
    @Param('uid') uid: string,
    @Body() taxonomyDto: EditTaxonomyDto,
  ): Promise<TaxonomyDto> {
    return this.taxonomyService.updateTaxonomy({
      uid,
      ...taxonomyDto,
    });
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteTaxonomy(@Param('uid') uid: string): Promise<TaxonomyDto> {
    return this.taxonomyService.deleteTaxonomy(uid);
  }
}
