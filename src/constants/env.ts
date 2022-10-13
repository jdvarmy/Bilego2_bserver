require('dotenv').config();

export const APP_VERSION = process.env.APP_VERSION || '0.0.1';
export const PORT = process.env.PORT || '3001';
export const BILEGO_URL =
  process.env.BILEGO_URL || 'http://chekisu6.bget.ru/wp-json/bilego/v1/front';
export const CLIENT_URL = process.env.CLIENT_URL || '1';
export const ADMIN_URL = process.env.ADMIN_URL || '2';

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
