import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { UsersService } from './services/users.service';
import { SaveUserDto } from './dtos/SaveUser.dto';
import { UserDto } from './dtos/User.dto';
import { Routs, UserEntityRole } from '../utils/types/enums';
import { AuthUser } from '../utils/decorators/AuthUser';
import { DataLoggerService } from '../logger/data.logger.service';

@Controller(Routs.users)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly dataLoggerService: DataLoggerService,
  ) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  public async getUsers(
    @AuthUser() user: UserDto,
    @Query('search') search?: string,
    @Query('role') role?: UserEntityRole,
  ): Promise<UserDto[]> {
    try {
      if (search || role) {
        return this.usersService.searchUsers({ search, role });
      }

      this.dataLoggerService.dbLog(
        `User ${user.uid} запросил список пользователей`,
      );

      return this.usersService.fetchUsers();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async getUser(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<UserDto> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.uid} запросил данные пользователя`,
      );

      return this.usersService.getUserData(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  public async saveUser(
    @AuthUser() user: UserDto,
    @Body() userDto: SaveUserDto,
  ): Promise<UserDto> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.uid} добавил нового пользователя`,
      );

      return this.usersService.saveUserData(userDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async saveEditUser(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
    @Body() userDto: SaveUserDto,
  ): Promise<UserDto> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.uid} обновил данные пользователя ${uid}`,
      );

      return this.usersService.saveUserData(userDto, uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async removeUser(
    @AuthUser() user: UserDto,
    @Param('uid') uid: string,
  ): Promise<UserDto> {
    try {
      this.dataLoggerService.dbLog(
        `User ${user.uid} удалил пользователя ${uid}`,
      );

      return this.usersService.deleteUserData(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
