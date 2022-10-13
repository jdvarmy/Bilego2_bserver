import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApiService } from './api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [ApiService],
  exports: [ApiService],
})
export class ApiModule {}
