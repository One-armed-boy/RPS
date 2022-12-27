import { IsEmail, IsString } from 'class-validator';

export class SignupDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;
}
