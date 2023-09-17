import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from '../../../database/entity';
import { Repository } from 'typeorm';
import { Exception500 } from '../../../utils/types/enums';
import { ItemDto } from '../dtos/item.dto';
import { ItemsPageProps, PostOptions } from '../../../utils/types/types';
import { v4 as uidv4 } from 'uuid';
import { SaveItemDto } from '../dtos/save-item.dto';
import { ItemsUtilsService } from './items.utils.service';
import { DatabaseService } from '../../../database/servises/database.service';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';

const scope = 'items';

@Injectable()
export class ItemsService {
  constructor(
    private readonly databaseService: DatabaseService,

    @Inject(ItemsUtilsService)
    private readonly itemsUtilsService: ItemsUtilsService,

    @InjectRepository(Items)
    private readonly itemsRepo: Repository<Items>,
  ) {}

  async fetchItems(
    options: PostOptions,
  ): Promise<{ items: ItemDto[]; props: ItemsPageProps }> {
    const query = this.itemsRepo
      .createQueryBuilder(scope)
      .select([
        `${scope}.uid`,
        `${scope}.status`,
        `${scope}.slug`,
        `${scope}.title`,
        `${scope}.city`,
      ])
      .orderBy(`${scope}.id`, 'DESC')
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

    const items = await query.getMany();

    if (!items) {
      throw new InternalServerErrorException(Exception500.findItems);
    }

    return {
      items: plainToClassResponse(ItemDto, items),
      props: {
        total: await this.databaseService.getTotal(options.filter, scope),
      },
    };
  }

  async getItem(uid: string): Promise<ItemDto> {
    const items = await this.itemsUtilsService.getItemByUid(uid, {
      taxonomy: true,
      headerImage: true,
      image: true,
    });

    return plainToClassResponse(ItemDto, items);
  }

  async saveItemTemplate(): Promise<ItemDto> {
    const uid = uidv4();

    const item = this.itemsRepo.create({
      uid,
      slug: `item-${+new Date()}`,
    });

    return plainToClassResponse(ItemDto, await this.itemsRepo.save(item));
  }

  async saveItem(data: SaveItemDto): Promise<ItemDto> {
    const { uid, taxonomy, headerImage, image, ...itemData } = data;

    const itemFromDb = await this.itemsUtilsService.getItemByUid(uid);

    const relations = await this.itemsUtilsService.getItemRelationData({
      taxonomy,
      headerImage,
      image,
    });

    const updateItemData = this.itemsRepo.create(itemData);
    const item = await this.itemsRepo.save({
      ...itemFromDb,
      ...updateItemData,
      ...relations,
    });

    return plainToClassResponse(ItemDto, item);
  }

  async deleteItem(uid: string): Promise<ItemDto> {
    const itemFromDb = await this.itemsUtilsService.getItemByUid(uid);
    const item = await this.itemsRepo.remove(itemFromDb);

    return plainToClassResponse(ItemDto, item);
  }
}
