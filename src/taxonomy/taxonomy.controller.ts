import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { ResTaxonomyDto } from './response/ResTaxonomyDto';
import { TaxonomyType, TaxonomyTypeLink, Version } from '../types/enums';
import { PostTaxonomyDto } from './request/PostTaxonomyDto';
import { ReqTaxonomyDto } from './request/ReqTaxonomyDto';
import { Taxonomy } from '../typeorm';

@Controller(`${Version._1}taxonomy`)
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get(':link')
  @UseGuards(AccessJwtAuthGuard)
  getTaxonomy(
    @Param('link') link: TaxonomyTypeLink,
    @Param('type') type?: TaxonomyType,
  ): Promise<ResTaxonomyDto[]> {
    try {
      return this.taxonomyService.getTaxonomy(link, type);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':link/:type')
  @UseGuards(AccessJwtAuthGuard)
  getTaxonomyByType(
    @Param('link') link: TaxonomyTypeLink,
    @Param('type') type?: TaxonomyType,
  ): Promise<ResTaxonomyDto[]> {
    try {
      return this.taxonomyService.getTaxonomy(link, type);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveTaxonomy(
    @Body() taxonomyDto: PostTaxonomyDto,
  ): Promise<ResTaxonomyDto[]> {
    try {
      return this.taxonomyService.saveTaxonomy(taxonomyDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':id')
  @UseGuards(AccessJwtAuthGuard)
  deleteTaxonomy(@Param('id') id: number): Promise<Taxonomy> {
    try {
      return this.taxonomyService.deleteTaxonomy(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Patch(':id')
  @UseGuards(AccessJwtAuthGuard)
  patchTaxonomy(
    @Param('id') id: number,
    // todo: заменить на более узкий тип данных
    // todo: посмотреть как проверять переменные в параметрах запроса
    @Body() taxonomyDto: ReqTaxonomyDto,
  ): Promise<ResTaxonomyDto> {
    try {
      return this.taxonomyService.updateTaxonomy({ id, ...taxonomyDto });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
