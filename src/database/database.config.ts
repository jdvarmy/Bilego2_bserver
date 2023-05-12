import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
  NODE_ENV,
} from '../utils/types/constants/env';
import entities from './entity';

export const databaseConfig = {
  type: 'mysql',
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DB,
  username: MYSQL_USER,
  password: MYSQL_PASS,
  entities: entities,
  synchronize: NODE_ENV === 'development',
  migrationsRun: false,
  logging: true,
  migrationsTableName: 'migration',
  migrations: [__dirname + '/migration/**/*.ts'],
  subscribers: [],
} as TypeOrmModuleOptions;

export default new DataSource(databaseConfig as DataSourceOptions);
