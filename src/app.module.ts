import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, UsersModule, PrismaModule],
})
export class AppModule {}
