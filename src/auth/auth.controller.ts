import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieTokenName, UserTokens } from '../utils/types/types';
import { Request, Response } from 'express';
import { LoginDto } from '../users/dtos/Login.dto';
import { setCookieRefreshToken } from '../utils';
import { Routs } from '../utils/types/enums';

@Controller(Routs.auth)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  public async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    try {
      const { refreshToken, ...data } = await this.authService.login({
        ...loginDto,
        ip: req.ip,
      });

      setCookieRefreshToken(response, refreshToken);

      return data;
    } catch (e) {
      const message = 'getResponse' in e ? e.getResponse().message : e.message;
      if (e instanceof UnauthorizedException) {
        throw new UnauthorizedException(message);
      }
      throw new InternalServerErrorException(message);
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
      const message = 'getResponse' in e ? e.getResponse().message : e.message;
      throw new InternalServerErrorException(message);
    }
  }

  @Get('refresh')
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    try {
      const { refreshToken } = request.cookies;

      const { refreshToken: refresh, ...data } = await this.authService.refresh(
        refreshToken,
      );

      setCookieRefreshToken(response, refresh);

      return data;
    } catch (e) {
      const message = 'getResponse' in e ? e.getResponse().message : e.message;
      if (e instanceof ForbiddenException) {
        throw new ForbiddenException(message);
      }
      throw new InternalServerErrorException(message);
    }
  }
}
