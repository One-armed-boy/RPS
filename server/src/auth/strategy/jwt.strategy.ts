import { AUTH_CONTSTANTS } from '@auth/auth.constant';
import { InvalidRefreshTokenException } from '@auth/auth.exception';
import { AccessTokenExtractor } from '@auth/token_extractors/access.extractor';
import { RefreshTokenExtractor } from '@auth/token_extractors/refresh.extractor';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected configService: ConfigService,
    protected accessTokenExtractor: AccessTokenExtractor,
  ) {
    super({
      jwtFromRequest: accessTokenExtractor.extract,
      ignoreExpiration: false,
      // 주입 문제 해결
      // link: https://stackoverflow.com/questions/50977202/nestjs-jwtstrategy-use-configservice-to-pass-secret-key
      secretOrKey: configService.get<string>(
        AUTH_CONTSTANTS.JWT_ACCESS_TOKEN_SECRET,
      ),
    });
  }

  async validate(payload: any) {
    return payload;
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    protected configService: ConfigService,
    protected refreshTokenExtractor: RefreshTokenExtractor,
  ) {
    super({
      jwtFromRequest: refreshTokenExtractor.extract,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(
        AUTH_CONTSTANTS.JWT_REFRESH_TOKEN_SECRET,
      ),
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const refreshToken = this.refreshTokenExtractor.extract(req);

    // 향후 Redis 내 RefreshToken과 비교 로직 추가 요망
    const tokenHolder = 'admin';
    if (!refreshToken || !tokenHolder) {
      throw new InvalidRefreshTokenException();
    }
    return { email: tokenHolder };
  }
}
