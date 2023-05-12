import { Module } from '@nestjs/common';
import { AuthService } from './servises/auth.service';
import { ConfigModule } from '@nestjs/config';
import { ApiModule } from '../api/api.module';
import { AuthController } from './auth.controller';
import { TokensModule } from '../tokens/tokens.module';
import { DatabaseModule } from '../database/database.module';
import { DataLoggerModule } from '../logger/data.logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule,
    TokensModule,
    DatabaseModule,
    DataLoggerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
