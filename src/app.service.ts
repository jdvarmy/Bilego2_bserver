import { Injectable } from '@nestjs/common';
import { APP_VERSION } from './constants/env';

@Injectable()
export class AppService {
  async getVersion() {
    return APP_VERSION || 'start version';
  }
}
