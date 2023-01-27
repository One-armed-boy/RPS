import { AuthService } from '@auth/auth.service';
import { CacheService } from '@cache/cache.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { AuthController } from '@auth/auth.controller';
import * as httpMocks from 'node-mocks-http';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  const mockResponse: Response = httpMocks.createResponse();

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'ACCESS_TOKEN_ISSUER',
          useValue: {
            sign: jest.fn().mockReturnValue('access_token'),
          },
        },
        {
          provide: 'REFRESH_TOKEN_ISSUER',
          useValue: {
            sign: jest.fn().mockReturnValue('refresh_token'),
          },
        },
        {
          provide: CacheService,
          useValue: {
            setRefreshToken: jest.fn().mockReturnValue(true),
            getEmailUsingRefreshToken: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: { findOneBy: jest.fn(), save: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(5),
          },
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('Login', () => {
    it('올바른 이메일과 비밀번호가 입력될 시', async () => {
      const mockUser = { email: 'abcd@gmail.com' };
      expect(await authService.login(mockResponse, mockUser)).toEqual({
        result: true,
        access_token: 'access_token',
        refresh_token: 'refresh_token',
      });
    });
    it('PassportJS의 오동작으로 user 객체 내 이메일이 포함되어있지 않은 경우', async () => {
      const mockUser = {};
      await expect(async () => {
        await authService.login(mockResponse, mockUser);
      }).rejects.toThrowError(InternalServerErrorException);
    });
  });
});
