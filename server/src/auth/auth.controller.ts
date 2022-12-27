import { Controller, Post, Req } from '@nestjs/common';
import { SignupDto } from '@auth/dto/signup.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Req() signupDto: SignupDto) {
    this.authService.signup(signupDto);
  }
}
