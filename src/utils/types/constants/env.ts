// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as process from 'process';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const APP_VERSION = process.env.APP_VERSION || '0.0.1';
export const PORT = process.env.PORT || '3001';
export const CLIENT_URL = process.env.CLIENT_URL || '1';
export const ADMIN_URL = process.env.ADMIN_URL || '2';

export const COOKIE_SECRET = process.env.COOKIE_SECRET || 'cookie-secret';

export const JWT_ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || 'secret-access';
export const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || 'secret-refresh';
export const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || '15m';
export const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || '60d';

export const MYSQL_HOST = process.env.MYSQL_HOST || 'localhost';
export const MYSQL_PORT = +process.env.MYSQL_PORT || 3306;
export const MYSQL_USER = process.env.MYSQL_USER || 'user';
export const MYSQL_PASS = process.env.MYSQL_PASS || 'pass';
export const MYSQL_DB = process.env.MYSQL_DB || MYSQL_USER;

export const STATIC_FILES_DIR = process.env.STATIC_FILES_DIR || 'upload';
export const CLOUD_S3_ACCESS = process.env.CLOUD_S3_ACCESS || '';
export const CLOUD_S3_SECRET = process.env.CLOUD_S3_SECRET || '';
export const CLOUD_S3_ENDPOINT = process.env.CLOUD_S3_ENDPOINT || '';
export const CLOUD_S3_BUCKET = process.env.CLOUD_S3_BUCKET || '';
