import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { coursesWithVideos } from 'src/course/dummy/data.dummy';

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

  async onApplicationShutdown(signal?: string) {
    if (signal === 'SIGINT') {
      console.log('Server closing!');
      return await this.cleanDb();
    }
  }

  async onApplicationBootstrap() {
    console.log('Creating new courses!');
    return coursesWithVideos.forEach(async (c) => {
      const videos = c.videos;
      delete c.videos;
      try {
        const course = await this.course.create({
          data: {
            title: c.title,
            description: c.description,
            author: c.author,
          },
        });

        await this.video.createMany({
          data: videos.map((v) => ({ ...v, courseId: course.id })),
        });
      } catch (err) {
        throw err;
      }
    });
  }
}
