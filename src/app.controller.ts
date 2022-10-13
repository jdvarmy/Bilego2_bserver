import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly databaseService: DatabaseService,
  ) {}

  @Get('version')
  async version() {
    try {
      // todo: delete on production
      await this.databaseService.initial();

      return this.appService.getVersion();
    } catch (e) {
      console.log(e);
    }
  }
}
