import { UserDto } from '../../users/dtos/user.dto';
import { City, PostStatus } from './enums';
import { HttpStatus } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';

export const CookieTokenName = 'refreshToken' as const;

export interface HttpExceptionResponse {
  statusCode: HttpStatus;
  error: string;
  message: string | number;
}
export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  ip: string;
  path: string;
  method: string;
  headers: IncomingHttpHeaders;
  body: XMLHttpRequestBodyInit;
  timeStamp: Date;
}

export type UserTokens = {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
};

export interface Slide {
  title: string;
  slug: string;
  image: string;
  date?: Date;
  terms?: string[];
}

export type MediaType = { id?: number; name?: string; path?: string };

export type PostOptions = {
  city?: City;
  search?: string;
  status?: PostStatus;
  filter?: Record<string, string | boolean | number>;
  offset: number;
  count: number;
};

export type ItemsPageProps = {
  total: number;
  offset?: number;
};

export type SharpType = {
  name: string;
  format: 'webp';
  path: string[];
  s3location?: string[];
  s3key?: string[];
};

export function exhaustiveCheck(value: never) {
  return value;
}
