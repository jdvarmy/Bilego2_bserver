import { UserDto } from '../dtos/UserDto';

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

export type MediaType = { id: number; name: string };
