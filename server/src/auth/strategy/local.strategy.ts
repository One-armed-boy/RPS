import { AuthService } from '@auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    const loginResult = await this.authService.login({ email, password });
    if (!loginResult) {
      throw new UnauthorizedException();
    }
    return loginResult;
  }
}
