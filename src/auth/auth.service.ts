import {
  ForbiddenException,
  Inject,
  Injectable,
  Scope,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokens } from 'src/utils/types/types';
import { ApiService } from '../api/api.service';
import { TokensService } from '../tokens/tokens.service';
import { JWT_REFRESH_SECRET } from '../utils/types/constants/env';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../users/dtos/User.dto';
import { Forbidden, Unauthorized } from '../utils/types/exceptionEnums';
import { plainToClassResponse } from '../utils/helpers/plainToClassResponse';
import { LoginUser } from '../users/types/types';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  constructor(
    private readonly apiService: ApiService,
    private readonly tokensService: TokensService,

    @Inject(REQUEST) private readonly request: Request,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async login(data: LoginUser): Promise<UserTokens> {
    const { email, password } = data;
    const user: Users = await this.usersRepo.findOne({
      where: { login: email },
    });

    if (!user) {
      throw new UnauthorizedException(Unauthorized.userNotFound);
    }

    if (!(await bcrypt.compare(password, user.pass))) {
      throw new UnauthorizedException(Unauthorized.wrongUserLoginData);
    }

    // Нужно, что бы это был просто объект
    const userDto = { ...plainToClassResponse(UserDto, user) };
    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(user, tokens.refreshToken, {
      ip: data.ip,
    });

    // this.logger.log(`Пользователь ${data?.email} вошел в систему`);
    return { user: userDto, ...tokens };
  }

  async logout(refreshToken: string): Promise<boolean> {
    return this.tokensService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<UserTokens> {
    if (!refreshToken || refreshToken === 'undefined') {
      throw new ForbiddenException(Forbidden.noRefreshToken);
    }

    const verifyToken = this.tokensService.verifyToken(
      refreshToken,
      JWT_REFRESH_SECRET,
    );
    const userIdFromBd = await this.tokensService.findToken(refreshToken);

    if (!verifyToken || !userIdFromBd) {
      throw new ForbiddenException(Forbidden.noValidToken);
    }

    const user: Users = await this.usersRepo.findOne({
      where: { id: userIdFromBd },
    });

    if (!user) {
      throw new ForbiddenException(Forbidden.userIsDeleted);
    }

    const userDto = { ...new UserDto(user) };
    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(user, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
}
