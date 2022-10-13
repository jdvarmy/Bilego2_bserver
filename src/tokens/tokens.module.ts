import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from './tokens.service';
import { ApiModule } from '../api/api.module';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ApiModule,
    JwtModule.register({}),
    DatabaseModule,
  ],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
