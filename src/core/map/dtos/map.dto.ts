import { Maps } from '../../../database/entity';
import { MediaDto } from '../../medialibrary/dtos/media.dto';
import { plainToClassResponse } from '../../../utils/helpers/plainToClassResponse';

export class MapDto {
  uid: string;
  map?: MediaDto;
  minimap?: MediaDto;
  xml?: string;
  viewBox?: string;
  width?: number;
  height?: number;
  // todo: типизировать
  background?: any[];
  attributes?: any;
  metadata?: any[];
  paths?: any[];
  seats?: any[];

  constructor(map: Maps) {
    this.uid = map.uid;
    this.map = map?.map ? plainToClassResponse(MediaDto, map.map) : undefined;
    this.minimap = map?.minimap
      ? plainToClassResponse(MediaDto, map.minimap)
      : undefined;
    this.xml = map?.xml || undefined;
    this.viewBox = map?.viewBox || undefined;
    this.width = map?.width || undefined;
    this.height = map?.height || undefined;
    this.background = map?.background ? JSON.parse(map.background) : undefined;
    this.attributes = map?.attributes ? JSON.parse(map.attributes) : undefined;
    this.metadata = map?.metadata ? JSON.parse(map.metadata) : undefined;
    this.paths = map?.paths ? JSON.parse(map.paths) : undefined;
    this.seats = map?.seats ? JSON.parse(map.seats) : undefined;
  }
}
