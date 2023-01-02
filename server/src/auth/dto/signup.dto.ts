import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignupDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}
