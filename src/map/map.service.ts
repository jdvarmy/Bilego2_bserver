import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MapDto } from '../dtos/MapDto';
import { FileService } from '../file/file.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Maps } from '../typeorm';
import { Repository } from 'typeorm';
import { Exception500 } from '../types/enums';
import { MedialibraryService } from '../medialibrary/medialibrary.service';
import { mapSVGParser } from '../helpers/mapSVGParser';
import { v4 as uidv4 } from 'uuid';

@Injectable()
export class MapService {
  constructor(
    private readonly fileService: FileService,
    private readonly medialibraryService: MedialibraryService,
    @InjectRepository(Maps) private mapRepo: Repository<Maps>,
  ) {}

  async getMapItems(): Promise<MapDto[]> {
    const maps: Maps[] = await this.mapRepo.find({
      order: { id: 'DESC' },
      relations: ['map'],
    });

    return maps.map(({ uid, map }) => new MapDto({ uid, map } as Maps));
  }

  async insertMapData(files: {
    map: Express.Multer.File;
    minimap: Express.Multer.File;
  }): Promise<boolean> {
    const { map, minimap } = files;

    if (map.mimetype !== 'image/svg+xml') {
      throw new InternalServerErrorException(Exception500.uploadMap);
    }

    const mapMediaDB = await this.medialibraryService.saveMediaToDB(map);
    const minimapMediaDB = await this.medialibraryService.saveMediaToDB(
      minimap,
    );

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

    await this.mapRepo.save(mapRepo);
    return true;
  }

  // UTILS
  async getMapByUid(uid: string): Promise<Maps> {
    const map = await this.mapRepo.findOne({
      where: { uid },
    });

    if (!map) {
      throw new InternalServerErrorException(Exception500.findMap);
    }

    return map;
  }
}
