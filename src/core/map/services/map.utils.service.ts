import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Maps } from '../../../database/entity';
import { Exception500 } from '../../../utils/types/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MapUtilsService {
  constructor(
    @InjectRepository(Maps)
    private readonly mapRepo: Repository<Maps>,
  ) {}

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
