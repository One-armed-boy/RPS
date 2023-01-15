import { JwtService, JwtSignOptions } from '@nestjs/jwt';

export abstract class TokenIssuer {
  constructor(protected jwtService: JwtService) {}

  sign(email?: string) {
    const [payload, signOptions] = this.getTokenOptions(email);
    return this.jwtService.sign(payload, signOptions);
  }

  abstract getTokenOptions(email: string | undefined): [any, JwtSignOptions];
}
