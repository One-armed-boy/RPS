import { AUTH_CONTSTANTS } from '@auth/auth.constant';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SetRefreshTokenDto } from './dto/set-refreshToken.dto';
import { RedisCacheService } from './redis/redis.service';

@Injectable()
export class CacheService {
  private refreshTokenExpiredTime: number;

  private getRefreshTokenKey(refreshToken: string): string {
    return `REFRESH_TOKEN:${refreshToken}:EMAIL`;
  }

  constructor(
    private cacheDBService: RedisCacheService,
    private configService: ConfigService,
  ) {
    this.refreshTokenExpiredTime = this.configService.get<number>(
      AUTH_CONTSTANTS.JWT_REFRESH_TOKEN_EXPIRE_TIME,
    );
  }

  // 책임: 로그인 시 리프레쉬 토큰을 캐싱
  async setRefreshToken({
    email,
    refreshToken,
  }: SetRefreshTokenDto): Promise<boolean> {
    try {
      return await this.cacheDBService.set(
        this.getRefreshTokenKey(refreshToken),
        email,
        this.refreshTokenExpiredTime,
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  // 책임: 캐싱된 리프레쉬 토큰을 통해 토큰 보유자가 누구인지 확인
  async getEmailUsingRefreshToken(
    refreshToken: string,
  ): Promise<string | null> {
    try {
      return await this.cacheDBService.get(
        this.getRefreshTokenKey(refreshToken),
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
