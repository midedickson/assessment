import { AuthGuard } from '@nestjs/passport';

class JwtGuard extends AuthGuard('jwt') {
  constructor() {
    super('jwt');
  }
}

export { JwtGuard };
