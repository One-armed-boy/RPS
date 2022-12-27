import { Module } from '@nestjs/common';
import { User } from '@user/user.entity';

@Module({
  providers: [User],
  exports: [User],
})
export class UserModule {}
