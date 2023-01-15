import { AUTH_CONTSTANTS } from '@auth/auth.constant';
import { InvalidRefreshTokenException } from '@auth/auth.exception';
import { TokenExtractor } from '@auth/token_extractors/parents.extractor';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { CacheService } from '@cache/cache.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    protected configService: ConfigService,
    @Inject('ACCESS_TOKEN_EXTRACTOR')
    protected accessTokenExtractor: TokenExtractor,
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
    @Inject('REFRESH_TOKEN_EXTRACTOR')
    protected refreshTokenExtractor: TokenExtractor,
    private cacheService: CacheService,
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
    if (!refreshToken) {
      throw new InvalidRefreshTokenException();
    }

    // 향후 Redis 내 RefreshToken과 비교 로직 추가 요망
    const tokenHolder = await this.cacheService.getEmailUsingRefreshToken(
      refreshToken,
    );
    if (!tokenHolder) {
      throw new InvalidRefreshTokenException();
    }
    return { email: tokenHolder };
  }
}
