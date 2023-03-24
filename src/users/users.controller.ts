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

@Controller(Routs.users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  public async getUsers(
    @Query('search') search?: string,
    @Query('role') role?: UserEntityRole,
  ): Promise<UserDto[]> {
    try {
      if (search || role) {
        return this.usersService.searchUsers({ search, role });
      }

      return this.usersService.fetchUsers();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async getUser(@Param('uid') uid: string): Promise<UserDto> {
    try {
      return this.usersService.getUserData(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  public async saveUser(@Body() userDto: SaveUserDto): Promise<UserDto> {
    try {
      return this.usersService.saveUserData(userDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async saveEditUser(
    @Param('uid') uid: string,
    @Body() userDto: SaveUserDto,
  ): Promise<UserDto> {
    try {
      return this.usersService.saveUserData(userDto, uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async removeUser(@Param('uid') uid: string): Promise<UserDto> {
    try {
      return this.usersService.deleteUserData(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
