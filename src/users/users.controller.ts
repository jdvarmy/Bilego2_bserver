import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccessJwtAuthGuard } from '../jwt/access-jwt-auth-guard.service';
import { UsersService } from './users.service';
import { ReqUserDto } from '../dtos/request/ReqUserDto';
import { UserDto } from '../dtos/UserDto';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AccessJwtAuthGuard)
  public async getUsers(@Req() req): Promise<UserDto[]> {
    try {
      return this.usersService.getUsersData();
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

  @Post('save')
  @UseGuards(AccessJwtAuthGuard)
  public async saveUser(@Body() userDto: ReqUserDto): Promise<boolean> {
    try {
      return this.usersService.saveUserData(userDto);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Put('save/:uid')
  @UseGuards(AccessJwtAuthGuard)
  public async saveEditUser(
    @Param('uid') uid: string,
    @Body() userDto: ReqUserDto,
  ): Promise<boolean> {
    try {
      return this.usersService.saveUserData(userDto, uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Delete(':uid')
  @UseGuards(AccessJwtAuthGuard)
  public async removeUser(@Param('uid') uid: string): Promise<boolean> {
    try {
      return this.usersService.deleteUserData(uid);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
