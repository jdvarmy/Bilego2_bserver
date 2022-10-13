import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { ReqTaxonomyDto } from '../dtos/request/ReqTaxonomyDto';
import { TaxonomyDto } from '../dtos/TaxonomyDto';
import { TaxonomyType, Version } from '../types/enums';

@Controller(`${Version._1}taxonomy`)
export class TaxonomyController {
  constructor(private readonly taxonomyService: TaxonomyService) {}

  @Get(':type')
  @UseGuards(AccessJwtAuthGuard)
  getTaxonomy(@Param('type') type: TaxonomyType): Promise<TaxonomyDto[]> {
    try {
      return this.taxonomyService.getTaxonomy(type);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveTaxonomy(@Body() taxonomyDto: ReqTaxonomyDto): Promise<TaxonomyDto[]> {
    try {
      return this.taxonomyService.saveTaxonomy(taxonomyDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
