import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ApiService } from '../api/api.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Media, UserAccess, Users } from '../typeorm';
import { Repository } from 'typeorm';
import { ReqUserDto } from '../dtos/request/ReqUserDto';
import { Exception500, UserEntityRole } from '../types/enums';
import * as bcrypt from 'bcrypt';
import { v4 as uidv4 } from 'uuid';
import { UserDto } from '../dtos/UserDto';
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations';

type SearchProps = {
  search?: string;
  role?: UserEntityRole;
};

@Injectable()
export class UsersService {
  constructor(
    private readonly apiService: ApiService,
    @InjectRepository(Media) private mediaRepo: Repository<Media>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(UserAccess)
    private userAccessRepo: Repository<UserAccess>,
  ) {}

  async getUsersList(): Promise<UserDto[]> {
    const users: Users[] = await this.usersRepo.find({
      relations: ['userAccess'],
      order: { id: 'DESC' },
    });

    return users.map((user) => new UserDto(user));
  }

  async searchUsersList({ search, role }: SearchProps): Promise<UserDto[]> {
    const users: Users[] = await this.usersRepo
      .createQueryBuilder('users')
      .select([
        'users.uid',
        'users.email',
        'users.name',
        'users.surname',
        'users.status',
      ])
      .where(
        (builder) => {
          //todo: переделать на builder
          const searchString: string[] = ['1=1'];

          if (role) {
            searchString.push('AND users.role = :role');
          }
          if (search) {
            searchString.push(`AND (
              lower(users.email) LIKE lower(:search) OR
              lower(users.name) LIKE lower(:search) OR
              lower(users.surname) LIKE lower(:search)
            )`);
          }

          return searchString.join(' ');
        },
        {
          search: `%${search}%`,
          role,
        },
      )
      .orderBy('users.surname', 'ASC')
      .limit(7)
      .getMany();

    return users.map((user) => new UserDto(user));
  }

  async getUserData(uid: string) {
    if (!uid) {
      throw new InternalServerErrorException(Exception500.getUser);
    }

    const user: Users = await this.getUserByUid(uid, {
      userAccess: true,
      avatar: true,
    });

    if (!user) {
      throw new InternalServerErrorException(Exception500.findUser);
    }

    return new UserDto(user);
  }

  async saveUserData(data: ReqUserDto, uid?: string): Promise<UserDto> {
    const user = await this.prepareUserDataToSave(data, uid);

    if (uid) {
      const editUser = await this.getUserByUid(uid);

      return new UserDto(await this.usersRepo.save({ ...editUser, ...user }));
    } else {
      return new UserDto(await this.usersRepo.save(user));
    }
  }

  async deleteUserData(uid: string): Promise<boolean> {
    const user = await this.getUserByUid(uid);
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

  // UTILS
  async getUserByUid(
    uid: string,
    relations?: FindOptionsRelations<Users>,
  ): Promise<Users> {
    const user = await this.usersRepo.findOne({
      where: { uid },
      relations,
    });

    if (!user) {
      throw new InternalServerErrorException(Exception500.findUser);
    }

    return user;
  }
}
