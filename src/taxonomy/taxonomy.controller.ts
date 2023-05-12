import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TaxonomyService } from './services/taxonomy.service';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { TaxonomyDto } from './dtos/Taxonomy.dto';
import { Routs, TaxonomyType, TaxonomyTypeLink } from '../utils/types/enums';
import { SaveTaxonomyDto } from './dtos/SaveTaxonomy.dto';
import { ItemsPageProps, PostOptions } from '../utils/types/types';
import { EditTaxonomyDto } from './dtos/EditTaxonomy.dto';
import { DataLoggerService } from '../logger/servises/data.logger.service';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';

@Controller(Routs.taxonomy)
export class TaxonomyController {
  constructor(
    private readonly taxonomyService: TaxonomyService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get([':link', ':link/:type'])
  getTaxonomyListByType(
    @Param('link') link: TaxonomyTypeLink,
    @Param('type') type?: TaxonomyType,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: TaxonomyDto[]; props: ItemsPageProps }> {
    try {
      const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
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
  async saveTaxonomy(
    @AuthUser() user: UserDto,
    @Body() taxonomyDto: SaveTaxonomyDto,
  ): Promise<TaxonomyDto> {
    try {
      const taxonomy = await this.taxonomyService.saveTaxonomy(taxonomyDto);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} создал таксономию ${taxonomy.uid}`,
        [HttpStatus.CREATED, 'Created'],
      );

      return taxonomy;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async putTaxonomy(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
    @Body() taxonomyDto: EditTaxonomyDto,
  ): Promise<TaxonomyDto> {
    try {
      const taxonomy = await this.taxonomyService.updateTaxonomy({
        uid,
        ...taxonomyDto,
      });

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} отредактировал таксономию ${
          taxonomy.uid
        }`,
      );

      return taxonomy;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async deleteTaxonomy(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<TaxonomyDto> {
    try {
      const taxonomy = await this.taxonomyService.deleteTaxonomy(uid);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} удалил таксономию ${
          taxonomy.name ?? taxonomy.uid
        }`,
      );

      return taxonomy;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
