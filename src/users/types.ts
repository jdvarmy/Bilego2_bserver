import { UserEntityRole } from '../utils/types/enums';

export type SearchProps = {
  search?: string;
  role?: UserEntityRole;
};

export type LoginUser = {
  email: string;
  password: string;
  ip?: string;
};

export type RegisterUser = LoginUser & {
  name: string;
};
