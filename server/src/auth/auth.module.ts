import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@auth/strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy } from '@auth/strategy/jwt.strategy';
import { AccessTokenIssuer } from '@auth/token_issuers/access.issuer';
import { RefreshTokenIssuer } from '@auth/token_issuers/refresh.issuer';
import { AccessTokenExtractor } from '@auth/token_extractors/access.extractor';
import { RefreshTokenExtractor } from '@auth/token_extractors/refresh.extractor';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: 'ACCESS_TOKEN_ISSUER', useClass: AccessTokenIssuer },
    { provide: 'REFRESH_TOKEN_ISSUER', useClass: RefreshTokenIssuer },
    { provide: 'ACCESS_TOKEN_EXTRACTOR', useClass: AccessTokenExtractor },
    { provide: 'REFRESH_TOKEN_EXTRACTOR', useClass: RefreshTokenExtractor },
  ],
})
export class AuthModule {}
