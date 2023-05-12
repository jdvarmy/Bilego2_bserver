import { Module } from '@nestjs/common';
import { DatabaseService } from './servises/database.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import entities from './entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature(entities)],
  providers: [DatabaseService],
  exports: [TypeOrmModule, DatabaseService],
})
export class DatabaseModule {}
