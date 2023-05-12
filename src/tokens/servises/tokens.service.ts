import { ForbiddenException, Inject, Injectable, Scope } from '@nestjs/common';
import { ApiService } from '../../api/api.service';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_ACCESS_EXPIRES,
  JWT_ACCESS_SECRET,
  JWT_REFRESH_EXPIRES,
  JWT_REFRESH_SECRET,
} from '../../utils/types/constants/env';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccess, Users } from '../../database/entity';
import { Repository } from 'typeorm';
import { UserDto } from '../../users/dtos/User.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TokensService {
  constructor(
    private readonly apiService: ApiService,
    private readonly jwtService: JwtService,

    @Inject(REQUEST) private readonly request: Request,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(UserAccess)
    private readonly userAccessRepo: Repository<UserAccess>,
  ) {}

  async saveToken(
    user: Users,
    token: string,
    meta?: { ip?: string | null },
  ): Promise<UserAccess> {
    const metaIp = '0.0.0.0';
    const metaDevice = this.request.get('User-Agent') || 'undefined';
    const userAccess: UserAccess = await this.userAccessRepo
      .createQueryBuilder('userAccess')
      .where('userAccess.user = :id', { id: user.id })
      .andWhere('userAccess.ip = :ip', { ip: meta?.ip || metaIp })
      .andWhere('userAccess.device = :device', { device: metaDevice })
      .getOne();

    if (userAccess) {
      userAccess.refreshToken = token;
      return this.userAccessRepo.save(userAccess);
    }

    const access = await this.userAccessRepo.insert({
      user,
      ip: meta?.ip || metaIp,
      device: metaDevice,
      refreshToken: token,
    });

    return access.raw;
  }

  async findToken(token: string): Promise<number> {
    const userAccess = await this.userAccessRepo.findOne({
      where: { refreshToken: token },
      relations: ['user'],
    });

    if (!userAccess?.user?.id) {
      throw new ForbiddenException();
    }

    return userAccess.user.id;
  }

  async removeToken(token: string): Promise<boolean> {
    const userAccess = await this.userAccessRepo.findOne({
      where: { refreshToken: token },
    });

    await this.userAccessRepo.remove(userAccess);
    return true;
  }

  generateTokens(payload: UserDto): {
    accessToken: string;
    refreshToken: string;
  } {
    return {
      accessToken: this.jwtService.sign(payload, {
        secret: JWT_ACCESS_SECRET,
        expiresIn: JWT_ACCESS_EXPIRES,
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: JWT_REFRESH_SECRET,
        expiresIn: JWT_REFRESH_EXPIRES,
      }),
    };
  }

  verifyToken(token: string, secret: string) {
    try {
      return this.jwtService.verify(token, {
        secret,
      });
    } catch (e) {
      return null;
    }
  }
}
