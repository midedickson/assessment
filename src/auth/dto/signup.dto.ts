import { IsEmail, IsNotEmpty } from 'class-validator';

class SignupDto {
  @IsNotEmpty()
  @IsEmail()
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export { SignupDto };
