import { UserDto } from '../dtos/UserDto';
import { City, PostStatus } from './enums';

export const CookieTokenName = 'refreshToken' as const;

export type WPError = {
  code: string;
  message: string;
  data: {
    status: boolean;
    code: number;
  };
};

export type LoginUser = {
  email: string;
  password: string;
  ip?: string | null;
};

export type RegisterUser = LoginUser & {
  name: string;
};

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
  filter?: Record<string, string>;
  offset: number;
  count: number;
};

export type ItemsPageProps = {
  total: number;
};
