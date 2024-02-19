import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.course.findMany();
  }

  async findOne(id: number) {
    // this method will normally get a couple
    // more information about a given course
    return await this.prismaService.course.findUnique({
      where: {
        id,
      },
    });
  }

  async searchCourseByTitle(title: string) {
    const courses = await this.prismaService.course.findMany({
      where: {
        title: {
          contains: title,
          mode: 'insensitive',
        },
      },
    });

    if (courses.length > 0) {
      return courses;
    } else {
      throw new NotFoundException(
        'Courses with title containing' + title + ' not found',
      );
    }
  }
}
