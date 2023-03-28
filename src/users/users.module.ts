import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { ApiModule } from '../api/api.module';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from '../auth/jwt/access-jwt-strategy.service';
import { DatabaseModule } from '../database/database.module';
import { UsersUtilsService } from './services/users.utils.service';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [ApiModule, PassportModule, DatabaseModule, DataLoggerModule],
  controllers: [UsersController],
  providers: [UsersService, UsersUtilsService, AccessJwtStrategy],
  exports: [UsersService, UsersUtilsService],
})
export class UsersModule {}
