import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as pactum from 'pactum';
import { LoginDto, SignupDto } from 'src/auth/dto';

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
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(() => {
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
          .expectStatus(400)
          .inspect();
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
          .expectStatus(400)
          .inspect();
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
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if payload is  empty', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400).inspect();
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withJson(signupDto)
          .expectStatus(201)
          .inspect();
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
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if both username and email is empty', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            password: loginDto.password,
          })
          .expectStatus(400)
          .inspect();
      });
      it('should throw error if payload is  empty', () => {
        return pactum.spec().post('/auth/login').expectStatus(400).inspect();
      });
      it('should signin with email', () => {
        return pactum
          .spec()
          .post('/auth/login')
          .withJson({
            email: loginDto.email,
            password: loginDto.password,
          })
          .expectStatus(200)
          .inspect();
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
      it.todo('should get all courses');
    });
    describe('Get courses by id', () => {
      it.todo('should get courses by id');
    });
    describe('Search Courses by title', () => {
      it.todo('should search courses by title');
    });
  });

  describe('Videos', () => {
    describe('Get all videos in course', () => {
      it.todo('should get all videos in course');
    });
    describe('Get video metadata by id', () => {
      it.todo('should video metadata by id');
    });
  });
});
