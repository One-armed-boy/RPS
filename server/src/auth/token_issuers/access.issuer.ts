import { AUTH_CONTSTANTS } from '@auth/auth.constant';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenIssuer } from '@auth/token_issuers/parents.issuer';

@Injectable()
export class AccessTokenIssuer extends TokenIssuer {
  private secret: string;
  private expiresIn: number;

  constructor(
    protected jwtService: JwtService,
    private configService: ConfigService,
  ) {
    super(jwtService);
    this.secret = this.configService.get<string>(
      AUTH_CONTSTANTS.JWT_ACCESS_TOKEN_SECRET,
    );
    this.expiresIn = this.configService.get<number>(
      AUTH_CONTSTANTS.JWT_ACCESS_TOKEN_EXPIRE_TIME,
    );
  }

  override getTokenOptions(email: string): [any, JwtSignOptions] {
    return [
      { email },
      { secret: this.secret, expiresIn: this.expiresIn * 1000 },
    ];
  }
}
