import {
  Controller,
  Get,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDto } from '../dtos/ItemDto';
import { City } from '../types/enums';

@Controller('v1/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getItemList(
    @Query('search') search: string,
    @Query('city') city?: City,
  ): Promise<ItemDto[]> {
    try {
      return this.itemsService.getItemList(search, city);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
