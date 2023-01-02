import { IsEmail, IsStrongPassword } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  // 기본값: 8자 이상, 대,소문자, 숫자, 특수문자 모두 포함해야 함
  // 옵션을 통해 비밀번호 설정 수정 가능
  @IsStrongPassword()
  password: string;
}
