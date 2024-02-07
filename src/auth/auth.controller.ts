import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    console.log({
      signupDto,
    });

    return this.authService.signup();
  }

  @Post('login')
  login() {
    return this.authService.login();
  }
}
