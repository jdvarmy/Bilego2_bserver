import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokensService } from './servises/tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [ConfigModule.forRoot(), JwtModule.register({}), DatabaseModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
