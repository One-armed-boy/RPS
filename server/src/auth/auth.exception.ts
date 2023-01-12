import { BadRequestException } from '@nestjs/common';

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
