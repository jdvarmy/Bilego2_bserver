import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TaxonomyDto } from '../dtos/Taxonomy.dto';
import cloneDeep from '../../utils';
import { Taxonomy } from '../../typeorm';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { Exception500, TaxonomyType } from '../../types/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedialibraryUtilsService } from '../../medialibrary/services/medialibrary.utils.service';
import { plainToClassResponse } from '../../helpers/plainToClassResponse';

@Injectable()
export class TaxonomyUtilsService {
  constructor(
    private readonly medialibraryUtilsService: MedialibraryUtilsService,

    @InjectRepository(Taxonomy)
    private readonly taxonomyRepo: Repository<Taxonomy>,
  ) {}

  async update(taxonomy): Promise<TaxonomyDto> {
    const tax = await this.taxonomyRepo.save(taxonomy);

    return plainToClassResponse(TaxonomyDto, tax);
  }

  async updateIndex(taxonomy): Promise<TaxonomyDto> {
    const oldItems = (await this.getTaxonomyByType(taxonomy.type)).map(
      (tax) => ({ uid: tax.uid, overIndex: tax.overIndex }),
    );
    const currentItem = { uid: taxonomy.uid, overIndex: taxonomy.overIndex };
    const index = oldItems.findIndex((item) => item.uid === currentItem.uid);
    const newItems = cloneDeep<typeof oldItems>(oldItems) as Array<{
      uid: string;
      overIndex: number;
    }>;

    if (index !== -1 && newItems) {
      newItems.splice(index, 1);
      newItems.splice(currentItem.overIndex, 0, currentItem);
      // перестраиваем индексы
      newItems.forEach((item, index) => (item.overIndex = index));

      const updateItems: Array<{ uid: string; overIndex: number }> = [];
      newItems.forEach((newItem, index) => {
        if (newItem.uid !== oldItems[index].uid) {
          updateItems.push(newItem);
        }
      });

      updateItems.forEach((item) => {
        this.taxonomyRepo
          .createQueryBuilder()
          .update(Taxonomy)
          .set({ overIndex: item.overIndex })
          .where('uid = :uid', { uid: item.uid })
          .execute();
      });
    }
    const tax = await this.taxonomyRepo.findOne({
      where: { uid: taxonomy.uid },
    });

    return plainToClassResponse(TaxonomyDto, tax);
  }

  async getMedia(props: { icon: number; image: number }) {
    const mediaIcon = await this.medialibraryUtilsService.getMediaById(
      props.icon,
    );
    const mediaImage = await this.medialibraryUtilsService.getMediaById(
      props.image,
    );

    return { icon: mediaIcon, image: mediaImage };
  }

  async getTaxonomies(taxonomies: string[]): Promise<Taxonomy[]> {
    const result = [];
    taxonomies.forEach((taxonomyUid) => {
      result.push(this.getTaxonomyByUid(taxonomyUid));
    });

    return Promise.all(result);
  }

  async getTaxonomyByUid(
    uid: string,
    relations: FindOptionsRelations<Taxonomy> = { icon: true, image: true },
  ): Promise<Taxonomy> {
    const taxonomy = await this.taxonomyRepo.findOne({
      where: { uid },
      relations,
    });

    if (!taxonomy) {
      throw new InternalServerErrorException(Exception500.findTaxonomy);
    }

    return taxonomy;
  }

  async getTaxonomyByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { type },
      order: { overIndex: 'asc', id: 'asc' },
    });
  }
}
