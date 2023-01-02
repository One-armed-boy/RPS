import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from '@auth/dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '@auth/dto/login.dto';

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

  async login({ email, password }: LoginDto): Promise<any> {
    const foundUser = await this.userRepository.findOneBy({ email });

    if (!foundUser) {
      return;
    }

    const comparePassword = await bcrypt.compare(password, foundUser.password);

    if (!comparePassword) {
      return;
    }

    const { password: _, ...user } = foundUser;
    return user;
  }
}
