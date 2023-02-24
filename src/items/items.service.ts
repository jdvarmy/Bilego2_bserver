import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from '../typeorm';
import { Repository } from 'typeorm';
import { Exception500 } from '../types/enums';
import { ItemDto } from './response/ItemDto';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';
import { PostOptions } from '../types/types';
import { v4 as uidv4 } from 'uuid';
import { ReqItemDto } from './request/ReqItemDto';
import { TaxonomyService } from '../taxonomy/taxonomy.service';
import { MedialibraryService } from '../medialibrary/medialibrary.service';

@Injectable()
export class ItemsService {
  constructor(
    private readonly taxonomyService: TaxonomyService,
    private readonly medialibraryService: MedialibraryService,
    @InjectRepository(Items) private itemsRepo: Repository<Items>,
  ) {}

  async getItemList(options: PostOptions): Promise<ItemDto[]> {
    const items = await this.itemsRepo
      .createQueryBuilder('items')
      .select([
        'items.uid',
        'items.status',
        'items.slug',
        'items.title',
        'items.city',
      ])
      // .where(
      //   'lower(items.title) LIKE lower(:search) /* AND items.status = :status */ AND items.city IN (:...city)',
      //   {
      //     search: `%${options.search}%`,
      //     // status: PostStatus.publish,
      //     city: options.city ? [options.city] : Object.values(City),
      //   },
      // )
      .orderBy('items.title', 'ASC')
      .skip(options.offset)
      .take(options.count)
      .getMany();

    if (!items) {
      throw new InternalServerErrorException(Exception500.findItems);
    }

    return items.map((item) => new ItemDto(item));
  }

  async getItem(uid: string) {
    return new ItemDto(
      await this.getItemByUid(uid, {
        taxonomy: true,
        headerImage: true,
        image: true,
      }),
    );
  }

  async saveItemTemplate(): Promise<ItemDto> {
    const uid = uidv4();

    const item = this.itemsRepo.create({
      uid,
      slug: `new-item-${+new Date()}`,
    });

    return new ItemDto(await this.itemsRepo.save(item));
  }

  async saveItem(data: ReqItemDto): Promise<ItemDto> {
    const { uid, taxonomy, headerImage, image, ...itemData } = data;

    const itemFromDb = await this.getItemByUid(uid);

    const relations = await this.getItemRelationData({
      taxonomy,
      headerImage,
      image,
    });

    const updateItemData = this.itemsRepo.create(itemData);
    return new ItemDto(
      await this.itemsRepo.save({
        ...itemFromDb,
        ...updateItemData,
        ...relations,
      }),
    );
  }

  async deleteItem(uid: string): Promise<ItemDto> {
    const itemFromDb = await this.getItemByUid(uid);
    return new ItemDto(await this.itemsRepo.remove(itemFromDb));
  }

  // UTILS
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
    taxonomy: number[];
    headerImage: number;
    image: number;
  }) {
    const relations: Partial<Items> = {};

    // Обновляем таксономию
    if (taxonomy) {
      relations['taxonomy'] = await this.taxonomyService.getTaxonomies([
        ...new Set(taxonomy),
      ]);
    }

    // Обновляем картинку площадки
    if (image) {
      relations['image'] = await this.medialibraryService.getMediaById(image);
    }

    // Обновляем заголовок площадки
    if (headerImage) {
      relations['headerImage'] = await this.medialibraryService.getMediaById(
        headerImage,
      );
    }

    return relations;
  }
}
