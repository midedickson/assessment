import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}
  login() {
    return {
      msg: 'User Logged in successfully',
      data: {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          username: 'johndoe',
          userType: 'student',
        },
        authToken: {
          access: 'dummyAccessToken',
          refresh: 'dummyrefreshToken',
        },
      },
    };
  }
  signup() {
    return {
      msg: 'User Created successfully',
      data: {
        userData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@gmail.com',
          username: 'johndoe',
          userType: 'student',
        },
        authToken: {
          access: 'dummyAccessToken',
          refresh: 'dummyrefreshToken',
        },
      },
    };
  }
}
