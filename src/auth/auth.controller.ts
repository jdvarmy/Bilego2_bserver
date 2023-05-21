import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './servises/auth.service';
import { CookieTokenName, UserTokens } from '../utils/types/types';
import { Request, Response } from 'express';
import { LoginDto } from '../users/dtos/login.dto';
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
    const { refreshToken, ...data } = await this.authService.login({
      ...loginDto,
      ip: req.ip,
    });

    setCookieRefreshToken(response, refreshToken);

    return data;
  }

  @Post('logout')
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    res.clearCookie(CookieTokenName);

    if (req?.cookies?.refreshToken) {
      return this.authService.logout(req.cookies.refreshToken);
    }

    return true;
  }

  @Get('refresh')
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<Omit<UserTokens, 'refreshToken'>> {
    const { refreshToken } = request.cookies;

    const { refreshToken: refresh, ...data } = await this.authService.refresh(
      refreshToken,
    );

    setCookieRefreshToken(response, refresh);

    return data;
  }
}
