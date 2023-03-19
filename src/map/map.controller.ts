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
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { MapDto } from './dtos/Map.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Exception500, Routs } from '../types/enums';

@Controller(Routs.map)
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getMapItems(): Promise<MapDto[]> {
    try {
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
  insertMedia(
    @UploadedFiles()
    files: {
      map?: Express.Multer.File[];
      minimap?: Express.Multer.File[];
    },
  ): Promise<boolean> {
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
      return this.mapService.insertMapData({
        map: map[0],
        minimap: minimap[0],
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
