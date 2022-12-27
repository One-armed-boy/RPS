import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async signup({ email, password }: SignupDto): Promise<boolean> {
    const duplicatedUser = await this.userRepository.findOneBy({
      email,
      deletedAt: null,
    });

    if (duplicatedUser) {
      return false;
    }

    const newUser = new User();
    newUser.createUser(email, password);
    await this.userRepository.save(newUser);
    return true;
  }
}
