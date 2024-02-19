import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { courseDummies } from 'src/course/dummy/data.dummy';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnApplicationShutdown, OnApplicationBootstrap
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([
      this.usersOnCourse.deleteMany(),
      this.video.deleteMany(),
      this.course.deleteMany(),
      this.user.deleteMany(),
    ]);
  }

  onApplicationShutdown(signal?: string) {
    if (signal === 'SIGINT') {
      console.log('Server closing!');
      return this.cleanDb();
    }
  }

  async onApplicationBootstrap() {
    console.log('Creating new courses!');
    return await this.course.createMany({
      data: courseDummies,
    });
  }
}
