import { Users } from '../typeorm';
import { UserEntityRole, UserEntityStatus } from '../types/enums';
import { MediaType } from '../types/types';

export class UserDto {
  uid: string;
  email: string;
  role?: UserEntityRole;
  name?: string;
  surname?: string;
  birthdate?: Date;
  phone?: string;
  status?: UserEntityStatus;
  access?: { ip: string; device: string; update: Date }[];
  avatar?: MediaType;

  constructor(user: Users) {
    this.uid = user.uid;
    this.email = user.email;
    this.role = user?.role;
    this.name = user?.name;
    this.surname = user?.surname;
    this.birthdate = user?.birthdate;
    this.phone = user?.phone;
    this.status = user?.status;
    this.access = user?.userAccess?.map(({ ip, device, updateDateTime }) => ({
      ip,
      device,
      update: updateDateTime,
    }));
    this.avatar = user?.avatar
      ? {
          id: user.avatar.id,
          name: user.avatar.name || user.avatar.originalName,
        }
      : undefined;
  }
}
