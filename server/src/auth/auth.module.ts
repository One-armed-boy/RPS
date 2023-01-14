import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy, JwtStrategy } from './strategy/jwt.strategy';
import { AccessTokenIssuer } from './token_issuers/access.issuer';
import { RefreshTokenIssuer } from './token_issuers/refresh.issuer';
import { AccessTokenExtractor } from './token_extractors/access.extractor';
import { RefreshTokenExtractor } from './token_extractors/refresh.extractor';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      // inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => {
      //   return {
      //     secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      //     signOptions: {
      //       expiresIn: configService.get<string>(
      //         'JWT_ACCESS_TOKEN_EXPIRE_TIME',
      //       ),
      //     },
      //   };
      // },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    AccessTokenIssuer,
    RefreshTokenIssuer,
    AccessTokenExtractor,
    RefreshTokenExtractor,
  ],
})
export class AuthModule {}
