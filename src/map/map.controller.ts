import {
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MapService } from './services/map.service';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { MapDto } from './dtos/Map.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Exception500, Routs } from '../utils/types/enums';
import { AuthUser } from '../utils/decorators/AuthUser';
import { UserDto } from '../users/dtos/User.dto';
import { DataLoggerService } from '../logger/data.logger.service';
import { Maps } from '../typeorm';

@Controller(Routs.map)
export class MapController {
  constructor(
    private readonly mapService: MapService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMapItems(@AuthUser() user: UserDto): Promise<MapDto[]> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} запросил список карт мероприятий`,
      );
      return this.mapService.fetchMapItems();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'map', maxCount: 1 },
      { name: 'minimap', maxCount: 1 },
    ]),
  )
  async insertMedia(
    @AuthUser() user: UserDto,
    @UploadedFiles()
    files: {
      map?: Express.Multer.File[];
      minimap?: Express.Multer.File[];
    },
  ): Promise<Maps> {
    const { map, minimap } = files;
    if (
      !map ||
      !minimap ||
      !Array.isArray(map) ||
      !Array.isArray(minimap) ||
      !map[0] ||
      !minimap[0]
    ) {
      throw new InternalServerErrorException(Exception500.uploadMapNoData);
    }

    try {
      const mapData = await this.mapService.insertMapData({
        map: map[0],
        minimap: minimap[0],
      });

      this.dataLoggerService.dbLog(
        `User ${user.email ?? user.uid} добавил карту ${mapData.uid}`,
        [HttpStatus.CREATED, 'Created'],
      );

      return mapData;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
  // todo: добавить удаление карт
}
