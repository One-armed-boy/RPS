import { IsEmail, IsString } from 'class-validator';

export class SetRefreshTokenDto {
  @IsEmail()
  email: string;

  @IsString()
  refreshToken: string;
}
