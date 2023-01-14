import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from '@auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '@auth/dto/login.dto';
import {
  DuplicateEmailSignupException,
  NonExistEmailLoginException,
  WrongPasswordLoginException,
} from '@auth/auth.exception';
import { Response } from 'express';
import { AccessTokenIssuer } from './token_issuers/access.issuer';
import { RefreshTokenIssuer } from './token_issuers/refresh.issuer';
import { AUTH_CONTSTANTS } from './auth.constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
    private accessTokenService: AccessTokenIssuer,
    private refreshTokenService: RefreshTokenIssuer,
  ) {}

  async signup({ email, password }: SignupDto): Promise<boolean> {
    const duplicatedUser = await this.userRepository.findOneBy({
      email,
      deletedAt: null,
    });

    if (duplicatedUser) {
      throw new DuplicateEmailSignupException();
    }

    const saltRounds = this.configService.get<number>(
      AUTH_CONTSTANTS.PASSWORD_HASH_ROUND,
    );
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User();
    newUser.createUser(email, hashedPassword);

    await this.userRepository.save(newUser);

    return true;
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
      return {
        result: false,
      };
    }
    const { email } = user;
    const accessToken = this.accessTokenService.sign(email);
    const refreshToken = this.refreshTokenService.sign();

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
