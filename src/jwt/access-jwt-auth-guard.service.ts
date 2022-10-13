import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ForbiddenException_403 } from '../types/enums';

@Injectable()
export class AccessJwtAuthGuard extends AuthGuard('accessjwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new ForbiddenException(ForbiddenException_403.token);
    }
    return user;
  }
}
