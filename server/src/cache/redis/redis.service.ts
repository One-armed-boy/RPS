import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService {
  constructor(@InjectRedis() private redis: Redis) {}

  async set(key: string, value: string, expiredTime: string): Promise<boolean> {
    const result = await this.redis.setex(key, expiredTime, value);
    return result === 'OK';
  }

  async get(key: string): Promise<string | null> {
    const result = await this.redis.get(key);
    return result;
  }
}
