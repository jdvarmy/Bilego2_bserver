// 401
export enum Unauthorized {
  undefined,
  userNotFound, // Нет пользователя с email
  wrongUserLoginData, // Неправильный пароль пользователя
}

// 403
export enum Forbidden {
  undefined,
  userIsDeleted, // Пользователь не найден
  tokenExpired, // Истек срок токена
  noRefreshToken, // Нет значения в refresh token
  noValidToken, // Refresh token не прошел верификацию
}

// 404
export enum NotFoundException {}

// 400
export enum BadRequestException {}
