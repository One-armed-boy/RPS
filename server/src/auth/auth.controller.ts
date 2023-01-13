import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SignupDto } from '@auth/dto/signup.dto';
import { AuthService } from '@auth/auth.service';
import { Request } from 'express';
import { LocalAuthGuard } from './auth.guard';

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
  async login(@Req() req: Request) {
    // 로그인 요청 성공 시 passport 모듈이 Request.user에 서비스 단에서 받은 데이터를 추가
    return this.authService.login(req.user);
  }
}
