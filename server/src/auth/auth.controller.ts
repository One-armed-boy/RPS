import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from '@auth/dto/signup.dto';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    const signupResult = await this.authService.signup(signupDto);
    return signupResult;
  }
}
