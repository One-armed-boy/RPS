import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { SignupDto, LoginDto } from '@auth/dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  DuplicateEmailSignupException,
  NonExistEmailLoginException,
  WrongPasswordLoginException,
} from '@auth/auth.exception';
import { Response } from 'express';
import { AUTH_CONTSTANTS } from '@auth/auth.constant';
import { TokenIssuer } from '@auth/token_issuers/parents.issuer';
import { CacheService } from '@cache/cache.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private cacheService: CacheService,
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @Inject('ACCESS_TOKEN_ISSUER') private accessTokenService: TokenIssuer,
    @Inject('REFRESH_TOKEN_ISSUER') private refreshTokenService: TokenIssuer,
  ) {}

  async signup({ email, password }: SignupDto): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const duplicatedUser = await queryRunner.manager
        .getRepository(User)
        .findOneBy({ email, deletedAt: null });

      if (duplicatedUser) {
        throw new DuplicateEmailSignupException();
      }

      const saltRounds = this.configService.get<number>(
        AUTH_CONTSTANTS.PASSWORD_HASH_ROUND,
      );
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const newUser = new User();
      newUser.createUser(email, hashedPassword);

      await queryRunner.manager.getRepository(User).save(newUser);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      throw err;
    }
  }

  async validateUser({ email, password }: LoginDto): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({ email });

    if (!foundUser) {
      throw new NonExistEmailLoginException();
    }

    const comparePassword = await bcrypt.compare(password, foundUser.password);

    if (!comparePassword) {
      throw new WrongPasswordLoginException();
    }

    const { password: _, ...user } = foundUser;
    return user;
  }

  async login(res: Response, user: { email?: string }) {
    if (!user || !user.email) {
      throw new InternalServerErrorException();
    }
    const { email } = user;
    const accessToken = this.accessTokenService.sign(email);
    const refreshToken = this.refreshTokenService.sign();

    const setRefreshTokenResult = await this.cacheService.setRefreshToken({
      email,
      refreshToken,
    });

    if (!setRefreshTokenResult) {
      throw new InternalServerErrorException();
    }

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      signed: true,
      //secure: true,
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      signed: true,
      //secure: true,
    });

    return {
      result: true,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  logout(res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      result: true,
    };
  }

  async resignAccessToken(res: Response, user: { email?: string }) {
    const { email } = user;
    const accessToken = this.accessTokenService.sign(email);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      signed: true,
    });

    return {
      result: true,
    };
  }
}
