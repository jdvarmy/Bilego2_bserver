import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserTokens } from 'src/utils/types/types';
import { TokensService } from '../../tokens/servises/tokens.service';
import { JWT_REFRESH_SECRET } from '../../utils/types/constants/env';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../../database/entity';
import { Repository } from 'typeorm';
import { UserDto } from '../../core/users/dtos/user.dto';
import { Forbidden, Unauthorized } from '../../utils/types/exceptionEnums';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { LoginUser } from '../../core/users/types';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,
  ) {}

  async login(data: LoginUser): Promise<UserTokens> {
    const { email, password, ip } = data;
    const user: Users = await this.usersRepo.findOne({
      where: { login: email },
    });

    if (!user) {
      throw new UnauthorizedException(Unauthorized.userNotFound);
    }

    if (!(await bcrypt.compare(password, user.pass))) {
      throw new UnauthorizedException(Unauthorized.wrongUserLoginData);
    }

    const userDto = plainToClassResponse(UserDto, user);
    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(user, tokens.refreshToken, { ip });

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
