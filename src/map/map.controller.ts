import {
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MapService } from './map.service';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { MapDto } from '../dtos/MapDto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Exception500 } from '../types/enums';

@Controller('v1/map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMapItems(): Promise<MapDto[]> {
    try {
      return this.mapService.getMapItems();
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
  insertMedia(
    @UploadedFiles()
    files: {
      map?: Express.Multer.File[];
      minimap?: Express.Multer.File[];
    },
  ): Promise<boolean> {
    const { map, minimap } = files;
    if (!map || !minimap || !map[0] || !minimap[0]) {
      throw new InternalServerErrorException(Exception500.uploadMapNoData);
    }

    try {
      return this.mapService.insertMapData({
        map: map[0],
        minimap: minimap[0],
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
