import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';
import { PassportModule } from '@nestjs/passport';
import { AccessJwtStrategy } from '../auth/jwt/access-jwt-strategy.service';
import { DatabaseModule } from '../database/database.module';
import { UsersUtilsService } from './services/users.utils.service';

@Module({
  imports: [PassportModule, DatabaseModule],
  controllers: [UsersController],
  providers: [UsersService, UsersUtilsService, AccessJwtStrategy],
  exports: [UsersService, UsersUtilsService],
})
export class UsersModule {}
