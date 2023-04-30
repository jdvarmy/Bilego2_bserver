import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('v1/version')
  async version() {
    try {
      return this.appService.getVersion();
    } catch (e) {
      console.log(e);
    }
  }
}
