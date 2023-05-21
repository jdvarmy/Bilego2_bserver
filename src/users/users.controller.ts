import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../auth/jwt/access-jwt-auth-guard.service';
import { UsersService } from './services/users.service';
import { SaveUserDto } from './dtos/save-user.dto';
import { UserDto } from './dtos/user.dto';
import { Routs, UserEntityRole } from '../utils/types/enums';

@Controller(Routs.users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  getUsers(
    @Query('search') search?: string,
    @Query('role') role?: UserEntityRole,
  ): Promise<UserDto[]> {
    if (search || role) {
      return this.usersService.searchUsers({ search, role });
    }

    return this.usersService.fetchUsers();
  }

  @Get(':uid')
  @UseGuards(AccessJwtAuthGuard)
  getUser(@Param('uid') uid: string): Promise<UserDto> {
    return this.usersService.getUserData(uid);
  }

  @Post()
  @UseGuards(AccessJwtAuthGuard)
  saveUser(@Body() userDto: SaveUserDto): Promise<UserDto> {
    return this.usersService.saveUserData(userDto);
  }

  @Put(':uid')
  @UseGuards(AccessJwtAuthGuard)
  saveEditUser(
    @Param('uid') uid: string,
    @Body() userDto: SaveUserDto,
  ): Promise<UserDto> {
    return this.usersService.saveUserData(userDto, uid);
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async removeUser(@Param('uid') uid: string): Promise<UserDto> {
    return this.usersService.deleteUserData(uid);
  }
}
