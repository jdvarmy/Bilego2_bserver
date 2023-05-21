import { Module } from '@nestjs/common';
import { AuthService } from './servises/auth.service';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { TokensModule } from '../tokens/tokens.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), TokensModule, DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
