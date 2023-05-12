import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JWT_ACCESS_SECRET } from '../../utils/types/constants/env';
import { Users } from '../../typeorm';
import { UsersUtilsService } from '../../users/services/users.utils.service';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'accessjwt') {
  constructor(private readonly usersUtilsService: UsersUtilsService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
    });
  }

  async validate(payload) {
    const { uid } = payload;
    const user: Users = await this.usersUtilsService.findOneUserByUid(uid);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
