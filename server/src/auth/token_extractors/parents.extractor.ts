import { Request } from 'express';

export interface TokenExtractor {
  extract(req: Request): string | null;
}
