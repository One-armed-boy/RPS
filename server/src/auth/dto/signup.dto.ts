import { IsString } from 'class-validator';

export class SignupDto {
  @IsString()
  email: string;
  @IsString()
  password: string;
}
