import { DataSource } from 'typeorm';
import {
  MYSQL_DB,
  MYSQL_HOST,
  MYSQL_PASS,
  MYSQL_PORT,
  MYSQL_USER,
  NODE_ENV,
} from '../utils/types/constants/env';
import entities from './entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

export const databaseConfig: MysqlConnectionOptions = {
  type: 'mysql',
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  database: MYSQL_DB,
  username: MYSQL_USER,
  password: MYSQL_PASS,
  entities: entities,
  synchronize: NODE_ENV === 'development',
  migrationsRun: false,
  // logging: NODE_ENV === 'development',
  migrationsTableName: 'migration',
  migrations: [__dirname + '/migration/**/*.ts'],
  subscribers: [],
};

export default new DataSource(databaseConfig);
