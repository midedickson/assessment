import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorators';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async findAll() {
    return await this.courseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseService.findOne(+id);
  }

  @Get()
  async searchCourseByTitle(@Param('title') title: string) {
    return await this.courseService.searchCourseByTitle(title);
  }

  @UseGuards(JwtGuard)
  @Post(':id/register')
  async registerUserToCourse(
    @GetUser('id') userId: string,
    @Param('id') courseId: string,
  ) {
    return await this.courseService.registerUserToCourse(+userId, +courseId);
  }

  @UseGuards(JwtGuard)
  @Get(':id/users')
  async getUsersRegisteredUnderACourses(@Param('id') userId: string) {
    return await this.courseService.getUsersRegisteredUnderACourse(+userId);
  }

  @UseGuards(JwtGuard)
  @Get('users/registered')
  async getUsersRegisteredCourses(@GetUser('id') userId: string) {
    return await this.courseService.getUsersRegisteredCourses(+userId);
  }

  @Get(':id/videos')
  async findAllVideosInCourse(@Param('id') courseId: string) {
    return await this.courseService.findAllVideosInCourse(+courseId);
  }
}
