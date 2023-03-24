import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Forbidden } from '../../utils/types/exceptionEnums';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('accessjwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new ForbiddenException(Forbidden.tokenExpired);
    }
    return user;
  }
}
