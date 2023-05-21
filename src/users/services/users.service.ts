import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccess, Users } from '../../database/entity';
import { Repository } from 'typeorm';
import { SaveUserDto } from '../dtos/save-user.dto';
import { Exception500 } from '../../utils/types/enums';
import { UserDto } from '../dtos/user.dto';
import { UsersUtilsService } from './users.utils.service';
import { plainToClassResponse } from '../../utils/helpers/plainToClassResponse';
import { SearchProps } from '../types';

@Injectable()
export class UsersService {
  constructor(
    @Inject(UsersUtilsService)
    private readonly usersUtilsService: UsersUtilsService,

    @InjectRepository(Users)
    private readonly usersRepo: Repository<Users>,

    @InjectRepository(UserAccess)
    private userAccessRepo: Repository<UserAccess>,
  ) {}

  async fetchUsers(): Promise<UserDto[]> {
    const users: Users[] = await this.usersRepo.find({
      relations: ['userAccess'],
      order: { id: 'DESC' },
    });

    return plainToClassResponse(UserDto, users);
  }

  async searchUsers({ search, role }: SearchProps): Promise<UserDto[]> {
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
        { search: `%${search}%`, role },
      )
      .orderBy('users.surname', 'ASC')
      .limit(7)
      .getMany();

    return plainToClassResponse(UserDto, users);
  }

  async getUserData(uid: string) {
    if (!uid) {
      throw new InternalServerErrorException(Exception500.getUser);
    }

    const user = await this.usersUtilsService.getUserByUid(uid, {
      userAccess: true,
      avatar: true,
    });

    if (!user) {
      throw new InternalServerErrorException(Exception500.findUser);
    }

    return plainToClassResponse(UserDto, user);
  }

  async saveUserData(data: SaveUserDto, uid?: string): Promise<UserDto> {
    const user = await this.usersUtilsService.prepareUserDataToSave(data, uid);

    if (uid) {
      const editUser = await this.usersUtilsService.getUserByUid(uid);

      return plainToClassResponse(
        UserDto,
        await this.usersRepo.save({ ...editUser, ...user }),
      );
    } else {
      return plainToClassResponse(UserDto, await this.usersRepo.save(user));
    }
  }

  async deleteUserData(uid: string): Promise<UserDto> {
    const user = await this.usersUtilsService.getUserByUid(uid);

    return plainToClassResponse(UserDto, await this.usersRepo.remove(user));
  }
}
