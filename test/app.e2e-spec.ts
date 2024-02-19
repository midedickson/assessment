import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import * as pactum from 'pactum';
import { LoginDto, SignupDto } from 'src/auth/dto';
import { PrismaService } from 'src/prisma/prisma.service';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    // Starts listening for shutdown hooks
    app.enableShutdownHooks();
    await app.init();

    await app.listen(3333);

    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
    console.log('Closing app');

    prisma = app.get(PrismaService);
    prisma.cleanDb();
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      const signupDto: SignupDto = {
        email: 'mide@miva.edu.ng',
        password: 'MideMiva123@',
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
      };
      it('should throw error if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            password: signupDto.password,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            username: signupDto.username,
          })
          .expectStatus(400);
      });
      it('should throw error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: signupDto.email,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
            username: signupDto.username,
          })
          .expectStatus(400);
      });
      it('should throw error if username empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson({
            email: signupDto.email,
            password: signupDto.password,
            firstName: signupDto.firstName,
            lastName: signupDto.lastName,
          })
          .expectStatus(400);
      });
      it('should throw error if payload is  empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(signupDto)
          .expectStatus(201);
      });

      it('should not signup existing user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(signupDto)
          .expectStatus(403);
      });
    });
    describe('Signin', () => {
      const loginDto: LoginDto = {
        email: 'mide@miva.edu.ng',
        password: 'MideMiva123@',
        username: 'johndoe',
      };
      it('should throw error if password empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            email: loginDto.email,
          })
          .expectStatus(400);
      });
      it('should throw error if both username and email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            password: loginDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if payload is  empty', () => {
        return pactum.spec().post('/auth/login').expectStatus(400);
      });
      it('should signin with email', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            email: loginDto.email,
            password: loginDto.password,
          })
          .expectStatus(200);
      });
      it('should signin with username', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            username: loginDto.username,
            password: loginDto.password,
          })
          .expectStatus(200)
          .stores('userAt', 'accessToken');
      });
    });
  });
  describe('Users', () => {
    describe('Get me', () => {
      it('should fail to get me', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
      it('should get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
    });
  });
  describe('Courses', () => {
    describe('Get all courses', () => {
      it('should get all courses', () => {
        return pactum
          .spec()
          .get('/courses')
          .expectStatus(200)
          .stores('FirstCourseId', '[0].id');
      });
    });
    describe('Get courses by id', () => {
      it('should get courses by id', () => {
        return pactum
          .spec()
          .get('/courses/$S{FirstCourseId}')
          .expectStatus(200);
      });
    });
    describe('Search Courses by title', () => {
      it('should search courses by title and exist', () => {
        pactum
          .spec()
          .get('/courses')
          .withQueryParams({ title: 'software' })
          .inspect()
          .expectStatus(200);
      });
      it('should search courses by title and not exist', () => {
        pactum
          .spec()
          .get('/courses')
          .withQueryParams({ title: 'mide' })
          .expectStatus(404);
      });
    });

    describe('User Registering Courses', () => {
      describe('user course registration', () => {
        it('should register user course', () => {
          return pactum
            .spec()
            .post('/courses/$S{FirstCourseId}/register')
            .withBearerToken('$S{userAt}')
            .expectStatus(201);
        });
        it('should fail to register user course beacuse course has been previously registered', () => {
          return pactum
            .spec()
            .post('/courses/$S{FirstCourseId}/register')
            .withBearerToken('$S{userAt}')
            .expectStatus(403);
        });
      });
      it('should get all courses registered by user', () => {
        return pactum
          .spec()
          .get('/courses/users/registered')
          .withBearerToken('$S{userAt}')
          .expectStatus(200);
      });
      it('should get all users registered under a course', () => {
        return pactum
          .spec()
          .get('/courses/$S{FirstCourseId}/users')
          .withBearerToken('$S{userAt}')
          .inspect()
          .expectStatus(200);
      });
    });
    describe('Get all videos in course', () => {
      it('should get all videos in course', () => {
        return pactum
          .spec()
          .get('/courses/$S{FirstCourseId}/videos')
          .expectStatus(200);
      });
    });
  });
});
