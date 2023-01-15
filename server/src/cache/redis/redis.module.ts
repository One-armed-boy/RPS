import { RedisModule } from '@liaoliaots/nestjs-redis';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRootAsync(
      {
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            config: [
              {
                host: configService.get<string>('CACHE_HOST'),
                port: configService.get<number>('CACHE_PORT'),
                password: configService.get<string>('CACHE_PASSWORD'),
              },
            ],
          };
        },
      },
      false,
    ),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
