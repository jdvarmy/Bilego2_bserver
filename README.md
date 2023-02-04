<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# API для билетного оператора

## Локальный запуск

### 1. Подготовка env-файлов

В проекте используется файл окружения Docker. Для запуска проекта, необходимо провести работу с ним

1. Копируем семпл в итоговый файл

```
cp .env-sample .env
```

2. Заполняем пустые значения в `.env`

### 2. Сборка и запуск

#### 2.1. Сборка

Для сборки образа, необходимо:

1. Заполнить **все пустые значения** в файле .env
2. Выполнить команду

```shell
docker compose build --no-cache
```

> ⚠️ Внимание!
>
> Если в вашем окружении установлена устаревшая версия compose, и команда `docker compose` падает с ошибкой -
> попробуйте запустить её в формате `docker-compose [ARGS]`, т.е. **через дефис**

#### 2.2. Запуск

После успешной сборки образа, запуск окружения осуществляется посредством вызова команды

```shell
docker compose up -d
```

#### 2.3. Проверка работоспособности

Для проверки работоспособности можно сделать следующее:

1. Воспользоваться инструкцией из п. 3

---

### 3. Мониторинг приложения

Для мониторинга приложения пользуемся механизмом логов докера:

```shell
docker compose logs -f app
```

### 4. Удаленная отладка

Для удаленной отладки кода в контейнере пользуемся любым предпочитаемым методом, в зависимости от используемой IDE.

Примеры:

- VSCode: https://www.bigbinary.com/blog/debug-nodejs-app-running-in-a-docker-container
- PHP/WebStorm: https://www.jetbrains.com/help/webstorm/node-with-docker.html#ws_node_docker_debug_app

---

### 5. Завершение работы с окружением

Для простого завершения работы необходимо выполнить следующую команду:

```shell
docker compose stop
```

Для завершения работы окружения с удалением вольюмов/сетей, средует выполнить

```shell
docker compose down
```

Для полного удаления окружения можно как воспользоваться приложением Docker Desktop, так и удалить **вообще все** артефакты докера с рабочей машины:

```shell
docker compose down
docker system prune -af
```

> ⚠️ Внимание!
>
> После выполнения `prune`, для повторного старта окружения придется снова выполнять сборку образа.

---

## Локальный запуск без докера (DEPRECATED)

Для разработки запускать $ npm start start:dev

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
`COMPOSE_PROJECT_NAME`= имя проекта \
`APP_VERSION`= версия приложения (0.0.1) \
`PORT`= порт для запуска приложения (3001) \
`BILEGO_URL`= устарело. адрес api wordpress (http://chekisu6.bget.ru/wp-json/bilego/v1/front) \
`STATIC_FILES_DIR`= папка для статических файлов (upload) 

`CLIENT_URL`= адрес клиента приложения (http://localhost:3000) \
`ADMIN_URL`= адрес администратора приложения (http://localhost:3003)

`JWT_ACCESS_SECRET`= секрет авторизации \
`JWT_REFRESH_SECRET`= секрет авторизации \
`JWT_ACCESS_EXPIRES`= время жизни (15m) \
`JWT_REFRESH_EXPIRES`= время жизни (60d) 

`MYSQL_HOST`= адрес БД (localhost) \
`MYSQL_PORT`= порт БД (3306) \
`MYSQL_DB`= имя БД (bilego2) \
`MYSQL_USER`= пользователь (dba) \
`MYSQL_PASS`= пароль (dba) 
