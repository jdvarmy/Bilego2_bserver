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
import { ItemsService } from './services/items.service';
import { ItemDto } from './dtos/Item.dto';
import { Routs } from '../utils/types/enums';
import { ItemsPageProps, PostOptions } from '../utils/types/types';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { compareUid } from '../utils/helpers/compareUid';
import { SaveItemDto } from './dtos/SaveItem.dto';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';
import { DataLoggerService } from '../logger/servises/data.logger.service';

@Controller(Routs.items)
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  getItemList(
    @Query('offset') offset?: number,
    @Query('count') count?: number,
    @Query('filter') filter?: Record<string, string>,
  ): Promise<{ items: ItemDto[]; props: ItemsPageProps }> {
    try {
      const props: PostOptions = { offset: offset ?? 0, count: count ?? 20 };
      if (filter) {
        props.filter = filter;
      }

      return this.itemsService.fetchItems(props);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':uid')
  getItem(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<ItemDto> {
    try {
      return this.itemsService.getItem(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  async saveItemTemplate(): Promise<ItemDto> {
    try {
      return await this.itemsService.saveItemTemplate();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async editItem(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
    @Body() itemDto: SaveItemDto,
  ): Promise<ItemDto> {
    try {
      compareUid(uid, itemDto.uid);
      const item = await this.itemsService.saveItem(itemDto);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} отредактировал площадку ${item.uid}`,
      );

      return item;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  async deleteItem(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<ItemDto> {
    try {
      const item = await this.itemsService.deleteItem(uid);

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} удалил площадку ${
          item.title ?? item.uid
        }`,
      );

      return item;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
