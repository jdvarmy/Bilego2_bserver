###<
# Root build args.
###>
ARG APP_DIR=/opt/app-root/app
###============================================================================###

###<
# Basic Buildtime phase.
#
# Should not be used without extending in other phases.
#  Usage: `FROM buildtime-base as some-buildtime` or `COPY --from=buildtime-base`.
###>
FROM node:16 as buildtime-base


# Build environment
ARG APP_DIR
ARG NODE_ENV

RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}

COPY --chown=1001:0 package*.json ${APP_DIR}/

RUN npm i --omit=optional && \
    npm i typescript -g

COPY --chown=1001:0 . ${APP_DIR}

RUN npm run build
###============================================================================###

###<
# Mysql Image Source.
#
###>
FROM mysql:5.7 as mysql
###============================================================================###

###<
# Basic Runtime phase.
#
# Should not be used without extending in other phases.
#  Usage: `FROM runtime-base as some-runtime` or `COPY --from=runtime-base`.
###>
FROM node:16 as runtime-base

ARG APP_DIR
ARG NODE_ENV
ENV LISTEN_PORT=3001

USER root

# set working directory
RUN mkdir -p ${APP_DIR}

WORKDIR ${APP_DIR}
###============================================================================###

###<
# Development Runtime phase.
#
# Use with `--target=runtime-development` or
#  `target: runtime-development` inside the docker-compose.
###>
FROM runtime-base as runtime-development

COPY --from=buildtime-base --chown=1001:1001 ${APP_DIR} ${APP_DIR}

EXPOSE 3001

CMD ["npm" , "run", "start:dev"]
