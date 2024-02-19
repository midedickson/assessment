import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    return await this.prismaService.course.findUniqueOrThrow({
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

  async registerUserToCourse(userId: number, courseId: number) {
    const user = await this.prismaService.user.findUniqueOrThrow({
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

  async getUsersRegisteredCourses(userId: number) {
    try {
      const user = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: userId,
        },
        include: {
          UsersOnCourse: true,
        },
      });
      // get user registered courses
      return user.UsersOnCourse;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async getUsersRegisteredUnderACourse(courseId: number) {
    try {
      const users = await this.prismaService.user.findMany({
        where: {
          UsersOnCourse: {
            some: {
              courseId: courseId,
            },
          },
        },
      });

      return users;
    } catch (err) {
      throw err;
    }
  }
}
