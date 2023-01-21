import { Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { RedisCacheModule } from './redis/redis.module';

@Module({
  imports: [RedisCacheModule],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
