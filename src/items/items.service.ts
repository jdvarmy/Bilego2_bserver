import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Items } from '../typeorm';
import { Repository } from 'typeorm';
import { City, Exception500, PostStatus } from '../types/enums';
import { ItemDto } from '../dtos/ItemDto';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

@Injectable()
export class ItemsService {
  constructor(@InjectRepository(Items) private itemsRepo: Repository<Items>) {}

  async getItemList(search: string, city?: City): Promise<ItemDto[]> {
    const items = await this.itemsRepo
      .createQueryBuilder('items')
      .select(['items.uid', 'items.title', 'items.city'])
      .where(
        'lower(items.title) LIKE lower(:search) AND items.status = :status AND items.city IN (:...city)',
        {
          search: `%${search}%`,
          status: PostStatus.publish,
          city: city ? [city] : Object.values(City),
        },
      )
      .orderBy('items.title', 'ASC')
      .getMany();

    if (!items) {
      throw new InternalServerErrorException(Exception500.findItems);
    }

    return items.map((item) => new ItemDto(item));
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
}
