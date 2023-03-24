import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from '../../typeorm';
import { Repository } from 'typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Exception500 } from '../../utils/types/enums';
import { MedialibraryUtilsService } from '../../medialibrary/services/medialibrary.utils.service';
import { TaxonomyUtilsService } from '../../taxonomy/services/taxonomy.utils.service';

@Injectable()
export class ItemsUtilsService {
  constructor(
    private readonly taxonomyUtilsService: TaxonomyUtilsService,
    private readonly medialibraryUtilsService: MedialibraryUtilsService,

    @InjectRepository(Items)
    private readonly itemsRepo: Repository<Items>,
  ) {}

  async getItemByUid(
    uid: string,
    relations?: FindOptionsRelations<Items>,
  ): Promise<Items> {
    const items = await this.itemsRepo.findOne({
      where: { uid },
      relations,
    });

    if (!items) {
      throw new InternalServerErrorException(Exception500.findItem);
    }

    return items;
  }

  async getItemRelationData({
    taxonomy,
    headerImage,
    image,
  }: {
    taxonomy: string[];
    headerImage: number;
    image: number;
  }) {
    const relations: Partial<Items> = {};

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.taxonomyUtilsService.getTaxonomies([
        ...new Set(taxonomy),
      ]);
    }

    // Обновляем картинку площадки
    if (image) {
      relations['image'] = await this.medialibraryUtilsService.getMediaById(
        image,
      );
    }

    // Обновляем заголовок площадки
    if (headerImage) {
      relations['headerImage'] =
        await this.medialibraryUtilsService.getMediaById(headerImage);
    }

    return relations;
  }
}
