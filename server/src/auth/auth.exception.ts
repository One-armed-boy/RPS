import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class DuplicateEmailSignupException extends BadRequestException {
  constructor() {
    super('The email you inputed is duplicated.');
  }
}

export class NonExistEmailLoginException extends BadRequestException {
  constructor() {
    super('The email you inputed does not exist.');
  }
}

export class WrongPasswordLoginException extends BadRequestException {
  constructor() {
    super('The password you inputed does not correct.');
  }
}

export class InvalidRefreshTokenException extends UnauthorizedException {
  constructor() {
    super('Your refresh token is invalid.');
  }
}

export class InvalidAccessTokenException extends UnauthorizedException {
  constructor() {
    super('Your access token is invalid.');
  }
}
