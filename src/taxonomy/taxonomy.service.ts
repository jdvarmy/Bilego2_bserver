import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PostTaxonomyDto } from './request/PostTaxonomyDto';
import { TaxonomyDto } from './response/TaxonomyDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Events, Media, Taxonomy } from '../typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Exception500, TaxonomyType, TaxonomyTypeLink } from '../types/enums';
import { PutTaxonomyDto } from './request/PutTaxonomyDto';
import cloneDeep from '../utils';
import { v4 as uidv4 } from 'uuid';
import { MedialibraryService } from '../medialibrary/medialibrary.service';
import { ItemsPageProps, PostOptions } from '../types/types';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class TaxonomyService {
  constructor(
    private readonly medialibraryService: MedialibraryService,
    @InjectRepository(Taxonomy) private taxonomyRepo: Repository<Taxonomy>,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
  ) {}

  async getTaxonomyList(
    link: TaxonomyTypeLink,
    options: PostOptions | undefined,
  ): Promise<{ items: TaxonomyDto[]; props: ItemsPageProps }> {
    const query = this.taxonomyRepo
      .createQueryBuilder('taxonomy')
      .select([
        'taxonomy.id',
        'taxonomy.uid',
        'taxonomy.name',
        'taxonomy.slug',
        'taxonomy.type',
        'taxonomy.link',
        'taxonomy.description',
        'taxonomy.overIndex',
        'taxonomy.showInMenu',
        'taxonomy.showInMainPage',
      ])
      .leftJoinAndSelect('taxonomy.icon', 'icon')
      .leftJoinAndSelect('taxonomy.image', 'image')
      .orderBy('taxonomy.overIndex', 'ASC')
      .skip(options.offset)
      .take(options.count);

    if (options.filter && Object.keys(options.filter).length) {
      query.where((builder) => this.andWhereCondition(builder, options.filter));
    }

    const taxonomies = await query.getMany();

    if (!taxonomies) {
      throw new InternalServerErrorException(Exception500.findTaxonomies);
    }

    return {
      items: taxonomies.map(this.toDto),
      props: { total: await this.getTotal(options.filter) },
    };
  }

  async saveTaxonomy(taxonomy: PostTaxonomyDto): Promise<TaxonomyDto> {
    const overIndex = await this.taxonomyRepo.findOne({
      where: { type: taxonomy.type },
      order: { overIndex: 'desc', id: 'desc' },
    });

    const tax = await this.taxonomyRepo.save({
      ...taxonomy,
      uid: uidv4(),
      overIndex: overIndex?.overIndex ? overIndex.overIndex + 1 : 0,
      ...(await this.getMedia({ icon: taxonomy.icon, image: taxonomy.image })),
    });

    return this.toDto(tax);
  }

  async deleteTaxonomy(uid: string): Promise<TaxonomyDto> {
    const taxonomy = await this.getTaxonomyByUid(uid);
    return new TaxonomyDto(await this.taxonomyRepo.remove(taxonomy));
  }

  async updateTaxonomy(taxonomy: PutTaxonomyDto): Promise<TaxonomyDto> {
    const { uid, icon, image, overIndex, ...props } = taxonomy;

    if (typeof overIndex === 'number' && overIndex + 1 && props.type) {
      // меняем порядок отображения
      return this.updateIndex({ uid, overIndex, ...props });
    } else {
      // просто обновляем таксономию
      const taxonomyFromDb = await this.getTaxonomyByUid(uid);
      const updateTaxonomyData = this.taxonomyRepo.create(props);
      const media = await this.getMedia({ icon, image });
      return this.update({
        ...taxonomyFromDb,
        ...updateTaxonomyData,
        ...media,
      });
    }
  }

  // HELPERS
  async update(taxonomy): Promise<TaxonomyDto> {
    return new TaxonomyDto(await this.taxonomyRepo.save(taxonomy));
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

    return new TaxonomyDto(
      await this.taxonomyRepo.findOne({ where: { uid: taxonomy.uid } }),
    );
  }

  async getMedia(props: { icon: number; image: number }) {
    const mediaIcon = await this.medialibraryService.getMediaById(props.icon);
    const mediaImage = await this.medialibraryService.getMediaById(props.image);

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

  toDto(taxonomy: Taxonomy): TaxonomyDto {
    return new TaxonomyDto(taxonomy);
  }

  async getTaxonomyByType(type: TaxonomyType): Promise<Taxonomy[]> {
    return this.taxonomyRepo.find({
      relations: ['icon', 'image'],
      where: { type },
      order: { overIndex: 'asc', id: 'asc' },
    });
  }

  andWhereCondition(
    builder: SelectQueryBuilder<Taxonomy>,
    filter: FindOptionsWhere<Taxonomy>,
  ) {
    return Object.entries(filter).forEach(([key, value]) => {
      const clearKey = key.replace(/[^a-zA-Z0-9]/g, '');

      if (typeof value === 'string') {
        builder.andWhere(
          `lower(taxonomy.${clearKey}) LIKE lower(:${clearKey})`,
          {
            [clearKey]: `%${value.trim()}%`,
          },
        );
      } else if (Array.isArray(value)) {
        builder.andWhere(`taxonomy.${clearKey} IN (:...${clearKey})`, {
          [clearKey]: value,
        });
      }
    });
  }

  async getTotal(params: FindOptionsWhere<Events>): Promise<number> {
    const query = this.taxonomyRepo
      .createQueryBuilder('taxonomy')
      .select('taxonomy.id');

    if (params && Object.keys(params).length) {
      query.where((builder) => this.andWhereCondition(builder, params));
    }

    return query.getCount();
  }
}
