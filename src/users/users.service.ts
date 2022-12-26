import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, UserAccess, Users } from '../typeorm';
import { Repository } from 'typeorm';
import { ReqUserDto } from '../dtos/request/ReqUserDto';
import { Exception500 } from '../types/enums';
import * as bcrypt from 'bcrypt';
import { v4 as uidv4 } from 'uuid';
import { UserDto } from '../dtos/UserDto';

@Injectable()
export class UsersService {
  constructor(
    private readonly apiService: ApiService,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(UserAccess)
    private userAccessRepo: Repository<UserAccess>,
  ) {}

  async getUsersData(): Promise<UserDto[]> {
    const users: Users[] = await this.usersRepo.find({
      relations: ['userAccess'],
      order: { id: 'DESC' },
    });

    return users.map((user) => new UserDto(user));
  }

  async getUserData(uid: string) {
    if (!uid) {
      throw new InternalServerErrorException(Exception500.getUser);
    }

    const user: Users = await this.usersRepo.findOne({
      relations: ['userAccess', 'avatar'],
      where: { uid },
    });

    if (!user) {
      throw new InternalServerErrorException(Exception500.findUser);
    }

    return new UserDto(user);
  }

  async saveUserData(data: ReqUserDto, uid?: string): Promise<boolean> {
    const user = await this.prepareUserDataToSave(data, uid);

    if (uid) {
      const editUser = await this.usersRepo.findOne({ where: { uid } });

      if (!editUser) {
        throw new InternalServerErrorException(Exception500.findUser);
      }

      // todo: переделать убрать await
      await this.usersRepo.save({ ...editUser, ...user });
    } else {
      await this.usersRepo.save(user);
    }

    return true;
  }

  async deleteUserData(uid: string): Promise<boolean> {
    const user = await this.usersRepo.findOne({ where: { uid } });
    await this.usersRepo.remove(user);

    return true;
  }

  async prepareUserDataToSave(data: ReqUserDto, uid?: string): Promise<Users> {
    const { email, password, avatar, ...userMeta } = data;
    if (!email || (!uid && !password)) {
      throw new InternalServerErrorException(Exception500.saveUser);
    }

    const user = this.usersRepo.create({
      uid: uidv4(),
      email,
      login: email,
      pass: await bcrypt.hash(password, 13),
      ...userMeta,
    });

    const userAvatar = await this.mediaRepo.findOne({ where: { id: avatar } });
    if (userAvatar) {
      user.avatar = userAvatar;
    }

    return user;
  }
}
