import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenExtractor } from './parents.extractor';

@Injectable()
export class RefreshTokenExtractor implements TokenExtractor {
  extract(req: Request): string {
    if (!req || !req.signedCookies || !req.signedCookies.refresh_token) {
      return null;
    }
    return req.signedCookies.refresh_token as string;
  }
}
