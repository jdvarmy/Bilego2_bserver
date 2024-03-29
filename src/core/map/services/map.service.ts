import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MapDto } from '../dtos/map.dto';
import { FileService } from '../../../file/services/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Maps } from '../../../database/entity';
import { Repository } from 'typeorm';
import { Exception500 } from '../../../utils/types/enums';
import { MedialibraryService } from '../../medialibrary/services/medialibrary.service';
import { mapSVGParser } from '../../../utils/helpers/mapSVGParser';
import { v4 as uidv4 } from 'uuid';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';

@Injectable()
export class MapService {
  constructor(
    private readonly fileService: FileService,
    private readonly medialibraryService: MedialibraryService,

    @InjectRepository(Maps)
    private readonly mapRepo: Repository<Maps>,
  ) {}

  async fetchMapItems(): Promise<MapDto[]> {
    const maps = await this.mapRepo.find({
      select: { uid: true },
      order: { id: 'DESC' },
      relations: ['map'],
    });

    return plainToClassResponse(MapDto, maps);
  }

  async insertMapData(files: {
    map: Express.Multer.File;
    minimap: Express.Multer.File;
  }): Promise<Maps> {
    const { map, minimap } = files;

    if (map.mimetype !== 'image/svg+xml') {
      throw new InternalServerErrorException(Exception500.uploadMap);
    }

    const mapMediaDB = await this.medialibraryService.saveMediaMap(map);
    const minimapMediaDB = await this.medialibraryService.saveMediaMap(minimap);

    const parsedMap = mapSVGParser(map.buffer);
    const mapData = Object.fromEntries(
      Object.entries(parsedMap).map(([key, element]) =>
        typeof element === 'string'
          ? [key, element]
          : [key, JSON.stringify(element)],
      ),
    );

    const mapRepo = this.mapRepo.create({
      uid: uidv4(),
      map: mapMediaDB,
      minimap: minimapMediaDB,
      ...mapData,
    });

    return this.mapRepo.save(mapRepo);
  }
}
