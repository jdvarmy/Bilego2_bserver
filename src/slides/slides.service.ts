import { Injectable } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { Slide } from '../utils/types/types';
import { City } from '../utils/types/enums';

@Injectable()
export class SlidesService {
  constructor(private readonly apiService: ApiService) {}

  async getSlides(city: City) {
    return this.apiService.get<Slide[]>('slides', { city });
  }
}
