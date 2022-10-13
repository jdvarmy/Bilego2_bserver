import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { JWT_ACCESS_SECRET } from '../constants/env';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'accessjwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_ACCESS_SECRET,
    });
  }

  validate(payload) {
    return payload;
  }
}
