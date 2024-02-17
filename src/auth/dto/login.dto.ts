import { IsNotEmpty, IsEmail, ValidateIf } from 'class-validator';

class LoginDto {
  @ValidateIf((o) => !o.username)
  @IsEmail()
  email?: string;

  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  username?: string;

  @IsNotEmpty()
  password: string;
}

export { LoginDto };
