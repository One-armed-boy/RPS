import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { TokenExtractor } from './parents.extractor';

@Injectable()
export class AccessTokenExtractor implements TokenExtractor {
  extract(req: Request): string {
    if (!req || !req.signedCookies || !req.signedCookies.access_token) {
      return null;
    }
    return req.signedCookies.access_token as string;
  }
}
