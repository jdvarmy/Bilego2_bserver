import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemDto } from './response/ItemDto';
import { City, Exception500 } from '../types/enums';
import { PostOptions } from '../types/types';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { compareUid } from '../helpers/compareUid';
import { ReqItemDto } from './request/ReqItemDto';

@Controller('v1/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getItemList(
    @Query('search') search?: string,
    @Query('city') city?: City,
    @Query('offset') offset?: number,
    @Query('count') count?: number,
  ): Promise<ItemDto[]> {
    try {
      const props: PostOptions = {
        search,
        city,
        offset: offset ?? 0,
        count: count ?? 20,
      };

      return this.itemsService.getItemList(props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  getItem(@Param('uid') uid: string): Promise<ItemDto> {
    try {
      if (!uid) {
        throw new InternalServerErrorException(Exception500.itemUid);
      }

      return this.itemsService.getItem(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveItemTemplate(): Promise<ItemDto> {
    try {
      return this.itemsService.saveItemTemplate();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  editItem(
    @Param('uid') uid: string,
    @Body() itemDto: ReqItemDto,
  ): Promise<ItemDto> {
    try {
      compareUid(uid, itemDto.uid);

      return this.itemsService.saveItem(itemDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  deleteItem(@Param('uid') uid: string): Promise<ItemDto> {
    try {
      return this.itemsService.deleteItem(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
