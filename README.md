<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# API для билетного оператора

Для разработки запускать $ npm start start:dev

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

### `Используются следующие переменные окружения`:
`APP_VERSION`= версия приложения (0.0.1) \
`PORT`= порт для запуска приложения (3001) \
`BILEGO_URL`= устарело. адрес api wordpress (http://chekisu6.bget.ru/wp-json/bilego/v1/front) \
`STATIC_FILES_DIR`= папка для статических файлов (upload) \

`CLIENT_URL`= адрес клиента приложения (http://localhost:3000) \
`ADMIN_URL`= адрес администратора приложения (http://localhost:3003) \

`JWT_ACCESS_SECRET`= секрет авторизации \
`JWT_REFRESH_SECRET`= секрет авторизации \
`JWT_ACCESS_EXPIRES`= время жизни (15m) \
`JWT_REFRESH_EXPIRES`= время жизни (60d) \

`MYSQL_HOST`= адрес БД (localhost) \
`MYSQL_PORT`= порт БД (3306) \
`MYSQL_DB`= имя БД (bilego2) \
`MYSQL_USER`= пользователь (dba) \
`MYSQL_PASS`= пароль (dba) \
