import {
  BadRequest,
  Forbidden,
  NotFound,
  Unauthorized,
} from '../utils/types/exceptionEnums';
import { HttpStatus } from '@nestjs/common';

const undefinedMessage = 'undefined message';

const UnauthorizedMessage: Record<Unauthorized, string> = {
  [Unauthorized.undefined]: undefinedMessage,
  [Unauthorized.userNotFound]: 'Нет пользователя с email',
  [Unauthorized.wrongUserLoginData]: 'Неправильный пароль пользователя',
};
const ForbiddenMessage: Record<Forbidden, string> = {
  [Forbidden.undefined]: undefinedMessage,
  [Forbidden.userIsDeleted]: 'Пользователь не найден',
  [Forbidden.tokenExpired]: 'Истек срок токена',
  [Forbidden.noRefreshToken]: 'Нет значения в refresh token',
  [Forbidden.noValidToken]: 'Refresh token не прошел верификацию',
};

export const logMessageMap = (status: HttpStatus, message: string | number) => {
  if (typeof message === 'string') {
    return message;
  }

  switch (status) {
    case HttpStatus.UNAUTHORIZED:
      return UnauthorizedMessage[message] ?? undefinedMessage;
    case HttpStatus.FORBIDDEN:
      return ForbiddenMessage[message] ?? undefinedMessage;
  }

  return undefinedMessage + ' no case';
};
