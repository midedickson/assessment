import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignupDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  /**
   * Logs an existing user in.
   * @param dto {LoginDto} - The user's log in information.
   * @returns The token of the identified user.
   * @throws {ForbiddenException} If the email and password don't match.
   */
  async login(loginDto: LoginDto) {
    let user: User;
    if (loginDto.email) {
      user = await this.prisma.user.findUnique({
        where: {
          email: loginDto.email,
        },
      });
    }
    if (loginDto.username) {
      user = await this.prisma.user.findUnique({
        where: {
          username: loginDto.username,
        },
      });
    }

    if (!user) {
      throw new ForbiddenException(
        'User with this email or username does not exist.',
      );
    }
    const isMatch = await argon.verify(user.hash, loginDto.password);
    if (!isMatch) {
      throw new ForbiddenException('Password is Incorrect!');
    }
    return {
      message: 'User logged in successfully',
      accessToken: await this.signToken(user.id, user.email),
    };
  }
  /**
   * Signs up a new user.
   * @param dto - The user's information.
   * @returns The newly created user.
   * @throws {ForbiddenException} If the email or username is already in use.
   */
  async signup(dto: SignupDto) {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
          firstName: dto.firstName,
          lastName: dto.lastName,
          username: dto.username,
        },
      });

      delete user.hash;
      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new ForbiddenException('Email OR Username  already exists');
        } else {
          throw err;
        }
      }
    }
  }

  async signToken(userId: number, email: string) {
    const payload = { sub: userId, email };
    return await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('SECRET_KEY'),
    });
  }
}
