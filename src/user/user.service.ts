import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async registerUserToCourse(userId: number, courseId: number) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        UsersOnCourse: true,
      },
    });
    // check if user has previosuly registered to the course
    const userRegisteredCourses = user.UsersOnCourse;
    if (
      userRegisteredCourses.length > 0 &&
      userRegisteredCourses.find((x) => x.courseId === courseId)
    ) {
      throw new ForbiddenException(
        'This user is already registered to this course.',
      );
    }

    // register user to the course
    try {
      await this.prismaService.usersOnCourse.create({
        data: {
          userId: userId,
          courseId: courseId,
        },
      });
    } catch (err) {
      throw err;
    }

    return {
      message: 'Course registration successful!',
    };
  }
}
