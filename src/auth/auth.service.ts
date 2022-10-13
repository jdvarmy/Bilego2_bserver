import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginUser, RegisterUser, UserTokens } from 'src/types/types';
import { checkWPErrorResponse } from '../utils';
import { ApiService } from '../api/api.service';
import { TokensService } from '../tokens/tokens.service';
import { JWT_REFRESH_SECRET } from '../constants/env';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Users } from '../typeorm';
import { Repository } from 'typeorm';
import {
  ForbiddenException_403,
  UnauthorizedException_401,
} from '../types/enums';
import { UserDto } from '../dtos/UserDto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly apiService: ApiService,
    private readonly tokensService: TokensService,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  // todo: refactor
  async register(data: RegisterUser): Promise<UserTokens> {
    const user = await this.apiService.post<UserDto>(`auth/register`, data);
    checkWPErrorResponse(user);

    const tokens = this.tokensService.generateTokens(user);

    // await this.tokensService.saveToken(user.uid, tokens.refreshToken);

    return { user, ...tokens };
  }

  async login(data: LoginUser): Promise<UserTokens> {
    const { email, password } = data;
    const user: Users = await this.usersRepo.findOne({
      where: { login: email },
    });

    if (!user) {
      throw new UnauthorizedException(UnauthorizedException_401.notFound);
    }

    if (!(await bcrypt.compare(password, user.pass))) {
      throw new UnauthorizedException(UnauthorizedException_401.wrongPass);
    }

    const userDto = { ...new UserDto(user) };
    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(user, tokens.refreshToken, {
      ip: data.ip,
    });

    return { user: userDto, ...tokens };
  }

  async logout(refreshToken: string): Promise<boolean> {
    return this.tokensService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string): Promise<UserTokens> {
    if (!refreshToken || refreshToken === 'undefined') {
      this.logger.error('Нет значения в refresh token');
      throw new ForbiddenException();
    }

    const verifyToken = this.tokensService.verifyToken(
      refreshToken,
      JWT_REFRESH_SECRET,
    );
    const userIdFromBd = await this.tokensService.findToken(refreshToken);

    if (!verifyToken || !userIdFromBd) {
      this.logger.debug('Refresh token не прошел верификацию');
      throw new ForbiddenException();
    }

    const user: Users = await this.usersRepo.findOne({
      where: { id: userIdFromBd },
    });

    if (!user) {
      this.logger.debug('Пользователь не найден');
      throw new ForbiddenException(ForbiddenException_403.deleted);
    }

    const userDto = { ...new UserDto(user) };
    const tokens = this.tokensService.generateTokens(userDto);
    await this.tokensService.saveToken(user, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }
}
