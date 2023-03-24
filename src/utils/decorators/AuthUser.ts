import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Users } from '../../typeorm';

interface AuthenticatedRequest extends Request {
  user: Users;
}

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = <AuthenticatedRequest>ctx.switchToHttp().getRequest();
    return request.user;
  },
);
