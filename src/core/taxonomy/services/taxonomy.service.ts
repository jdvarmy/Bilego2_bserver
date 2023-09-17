import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { SaveTaxonomyDto } from '../dtos/save-taxonomy.dto';
import { TaxonomyDto } from '../dtos/taxonomy.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Taxonomy } from '../../../database/entity';
import { Repository } from 'typeorm';
import { Exception500, TaxonomyTypeLink } from '../../../utils/types/enums';
import { EditTaxonomyDto } from '../dtos/edit-taxonomy.dto';
import { v4 as uidv4 } from 'uuid';
import { ItemsPageProps, PostOptions } from '../../../utils/types/types';
import { DatabaseService } from '../../../database/servises/database.service';
import { TaxonomyUtilsService } from './taxonomy.utils.service';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';

const scope = 'taxonomy';

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly databaseService: DatabaseService,

    @Inject(TaxonomyUtilsService)
    private readonly taxonomyUtilsService: TaxonomyUtilsService,

    @InjectRepository(Taxonomy)
    private readonly taxonomyRepo: Repository<Taxonomy>,
  ) {}

  async getTaxonomyList(
    link: TaxonomyTypeLink,
    options: PostOptions | undefined,
  ): Promise<{ items: TaxonomyDto[]; props: ItemsPageProps }> {
    const query = this.taxonomyRepo
      .createQueryBuilder(scope)
      .select([
        `${scope}.id`,
        `${scope}.uid`,
        `${scope}.name`,
        `${scope}.slug`,
        `${scope}.type`,
        `${scope}.link`,
        `${scope}.description`,
        `${scope}.overIndex`,
        `${scope}.showInMenu`,
        `${scope}.showInMainPage`,
      ])
      .leftJoinAndSelect(`${scope}.icon`, 'icon')
      .leftJoinAndSelect(`${scope}.image`, 'image')
      .orderBy(`${scope}.overIndex`, 'ASC')
      .addOrderBy(`${scope}.id`, 'ASC')
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

    const taxonomies = await query.getMany();

    if (!taxonomies) {
      throw new InternalServerErrorException(Exception500.findTaxonomies);
    }

    return {
      items: plainToClassResponse(TaxonomyDto, taxonomies),
      props: {
        total: await this.databaseService.getTotal(options.filter, scope),
      },
    };
  }

  async saveTaxonomy(taxonomy: SaveTaxonomyDto): Promise<TaxonomyDto> {
    const overIndex = await this.taxonomyRepo.findOne({
      where: { type: taxonomy.type },
      order: { overIndex: 'desc', id: 'desc' },
    });

    const tax = await this.taxonomyRepo.save({
      ...taxonomy,
      uid: uidv4(),
      overIndex: overIndex?.overIndex ? overIndex.overIndex + 1 : 0,
      ...(await this.taxonomyUtilsService.getMedia({
        icon: taxonomy.icon,
        image: taxonomy.image,
      })),
    });

    return plainToClassResponse(TaxonomyDto, tax);
  }

  async deleteTaxonomy(uid: string): Promise<TaxonomyDto> {
    const taxonomy = await this.taxonomyUtilsService.getTaxonomyByUid(uid);
    return new TaxonomyDto(await this.taxonomyRepo.remove(taxonomy));
  }

  async updateTaxonomy(taxonomy: EditTaxonomyDto): Promise<TaxonomyDto> {
    const { uid, icon, image, overIndex, ...props } = taxonomy;

    if (typeof overIndex === 'number' && overIndex + 1 && props.type) {
      // меняем порядок отображения
      return this.taxonomyUtilsService.updateIndex({
        uid,
        overIndex,
        ...props,
      });
    } else {
      // просто обновляем таксономию
      const taxonomyFromDb = await this.taxonomyUtilsService.getTaxonomyByUid(
        uid,
      );
      const updateTaxonomyData = this.taxonomyRepo.create(props);
      const media = await this.taxonomyUtilsService.getMedia({ icon, image });

      return this.taxonomyUtilsService.update({
        ...taxonomyFromDb,
        ...updateTaxonomyData,
        ...media,
      });
    }
  }
}
