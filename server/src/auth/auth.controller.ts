import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignupDto } from '@auth/dto/signup.dto';
import { AuthService } from '@auth/auth.service';
import {
  JwtAuthGuard,
  JwtRefreshAuthGuard,
  LocalAuthGuard,
} from '@auth/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const signupResult = await this.authService.signup(signupDto);
    return signupResult;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    // passthrough를 추가해주어야 NestJS에 이후 response 반환을 맡길 수 있음.
    // 하지 않는다면 직접 response를 반환해주는 로직을 작성해야 함.
    @Res({ passthrough: true }) res: Response,
  ) {
    // 로그인 요청 성공 시 passport 모듈이 Request.user에 서비스 단에서 받은 데이터를 추가
    return this.authService.login(res, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authInfo(@Req() req: Request) {
    return true;
  }

  @UseGuards(JwtRefreshAuthGuard)
  @Get('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.resignAccessToken(res, req.user);
  }
}
