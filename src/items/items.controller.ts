import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './services/items.service';
import { ItemDto } from './dtos/item.dto';
import { Routs } from '../utils/types/enums';
import { ItemsPageProps, PostOptions } from '../utils/types/types';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { compareUid } from '../utils/helpers/compareUid';
import { SaveItemDto } from './dtos/save-item.dto';

@Controller(Routs.items)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  getItemList(
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: ItemDto[]; props: ItemsPageProps }> {
    const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
    if (filter) {
      props.filter = filter;
    }

    return this.itemsService.fetchItems(props);
  }

  @Get(':uid')
  getItem(@Param('uid') uid: string): Promise<ItemDto> {
    return this.itemsService.getItem(uid);
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveItemTemplate(): Promise<ItemDto> {
    return this.itemsService.saveItemTemplate();
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  editItem(
    @Param('uid') uid: string,
    @Body() itemDto: SaveItemDto,
  ): Promise<ItemDto> {
    compareUid(uid, itemDto.uid);
    return this.itemsService.saveItem(itemDto);
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteItem(@Param('uid') uid: string): Promise<ItemDto> {
    return this.itemsService.deleteItem(uid);
  }
}
