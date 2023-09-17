import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MapService } from './services/map.service';
import { AccessJwtAuthGuard } from '../../auth/jwt/access-jwt-auth-guard.service';
import { MapDto } from './dtos/map.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Exception500, Routs } from '../../utils/types/enums';
import { Maps } from '../../database/entity';

@Controller(Routs.map)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMapItems(): Promise<MapDto[]> {
    return this.mapService.fetchMapItems();
  }

  @Post('upload')
  @UseGuards(AccessJwtAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'map', maxCount: 1 },
      { name: 'minimap', maxCount: 1 },
    ]),
  )
  insertMedia(
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

    return this.mapService.insertMapData({
      map: map[0],
      minimap: minimap[0],
    });
  }
  // todo: добавить удаление карт
}
