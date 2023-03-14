import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { TaxonomyDto } from './response/TaxonomyDto';
import { TaxonomyType, TaxonomyTypeLink, Version } from '../types/enums';
import { PostTaxonomyDto } from './request/PostTaxonomyDto';
import { ItemsPageProps, PostOptions } from '../types/types';
import { PutTaxonomyDto } from './request/PutTaxonomyDto';

@Controller(`${Version._1}taxonomy`)
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get([':link', ':link/:type'])
  @UseGuards(AccessJwtAuthGuard)
  getTaxonomyListByType(
    @Param('link') link: TaxonomyTypeLink,
    @Param('type') type?: TaxonomyType,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: TaxonomyDto[]; props: ItemsPageProps }> {
    try {
      const props: PostOptions = {
        offset: offset ?? 0,
        count: count ?? 20,
      };
      if (filter) {
        props.filter = filter;
      }

      return this.taxonomyService.getTaxonomyList(link, props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveTaxonomy(@Body() taxonomyDto: PostTaxonomyDto): Promise<TaxonomyDto> {
    try {
      return this.taxonomyService.saveTaxonomy(taxonomyDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteTaxonomy(@Param('uid') uid: string): Promise<TaxonomyDto> {
    try {
      return this.taxonomyService.deleteTaxonomy(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  putTaxonomy(
    @Param('uid') uid: string,
    // todo: заменить на более узкий тип данных
    // todo: посмотреть как проверять переменные в параметрах запроса
    @Body() taxonomyDto: PutTaxonomyDto,
  ): Promise<TaxonomyDto> {
    try {
      return this.taxonomyService.updateTaxonomy({ uid, ...taxonomyDto });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
