import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '@user/user.entity';
import { UserModule } from '@user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [User],
          synchronize: configService.get('DEV_MODE'), // 서버가 실행될 때마다 DB 테이블을 재생성, 실제 prod 환경에서는 사용하면 안됨
          dropSchema: configService.get('DEV_MODE'), // 서버가 실행될 때마다 기존 DB의 스키마 삭제, 실제 prod 환경에서는 사용 금지
        };
      },
    }),
  ],
})
export class DatabaseModule {}
