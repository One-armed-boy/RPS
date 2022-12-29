import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {}
  async signup({ email, password }: SignupDto): Promise<boolean> {
    const duplicatedUser = await this.userRepository.findOneBy({
      email,
      deletedAt: null,
    });

    if (duplicatedUser) {
      return false;
    }

    const saltRounds = this.configService.get<number>('PASSWORD_HASH_ROUND');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User();
    newUser.createUser(email, hashedPassword);

    await this.userRepository.save(newUser);

    return true;
  }
}
