import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieTokenName, UserTokens } from '../types/types';
import { Request, Response } from 'express';
import { ReqRegisterDto } from '../dtos/request/ReqRegisterDto';
import { ReqLoginDto } from '../dtos/request/ReqLoginDto';
import { AuthHttpExceptionFilter } from './auth-http-exception.filter';
import { setCookieRefreshToken } from '../utils';
import { IpDecorator } from '../decorators/ip.decorator';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // todo: refactor
  @Post('register')
  @UseFilters(new AuthHttpExceptionFilter())
  public async register(
    @Body() registerDto: ReqRegisterDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    try {
      const { refreshToken, ...data } = await this.authService.register({
        ...registerDto,
      });

      setCookieRefreshToken(response, refreshToken);

      return data;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('login')
  @UseFilters(new AuthHttpExceptionFilter())
  public async login(
    @Body() loginDto: ReqLoginDto,
    @Res({ passthrough: true }) response: Response,
    @IpDecorator() userIp,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    try {
      const { refreshToken, ...data } = await this.authService.login({
        ...loginDto,
        ip: userIp,
      });

      setCookieRefreshToken(response, refreshToken);

      return data;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    try {
      res.clearCookie(CookieTokenName);

      if (req?.cookies?.refreshToken) {
        return this.authService.logout(req.cookies.refreshToken);
      }

      return true;
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }

  @Get('refresh')
  public async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    try {
      const { refreshToken } = req.cookies;

      const { refreshToken: refresh, ...data } = await this.authService.refresh(
        refreshToken,
      );

      setCookieRefreshToken(response, refresh);

      return data;
    } catch (e) {
      throw new ForbiddenException(e.message);
    }
  }
}
