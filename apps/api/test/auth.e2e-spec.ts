import * as request from 'supertest';

import { faker } from '@faker-js/faker/.';
import { HttpStatus, INestApplication, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/common/database/database.service';
import { RegisterUserDto } from 'src/models/auth/dto/register-user.dto';
import { RegisterUserResponseDto } from 'src/models/auth/dto/register-user-response.dto';
import { LoginUserDto } from 'src/models/auth/dto/login-user.dto';
import { LoginUserResponseDto } from 'src/models/auth/dto/login-user-response.dto';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { RevalidateSessionResponseDto } from 'src/models/auth/dto/revalidate-session-response.dto';

import { setupApp } from 'src/common/setup/app/app.setup';
import { LogoutUserResponseDto } from 'src/models/auth/dto/logout-user-response.dto';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  const userPayload = {
    email: faker.internet.email({
      firstName: 'test',
      lastName: 'e2e',
      provider: 'example.com',
      allowSpecialCharacters: true,
    }),
    password: faker.internet.password(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    setupApp(app, new Logger('AuthControllerTest'));

    await app.init();

    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany(); // clean up
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send(userPayload as RegisterUserDto)
        .expect(HttpStatus.CREATED);

      const body = response.body as RegisterUserResponseDto;

      expect(body).toBeDefined();
      expect(body).toHaveProperty('userId');
      expect(body).not.toHaveProperty('password');
    });
  });

  describe('/auth/login (POST)', () => {
    it('should login a user and set refreshToken cookie', async () => {
      const emailVo = EmailAddressFactory.from(userPayload.email);

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(userPayload as LoginUserDto)
        .expect(HttpStatus.OK);

      const body: LoginUserResponseDto = response.body;
      const headers = response.headers;

      expect(body).toBeDefined();
      expect(body).toHaveProperty('accessToken');
      expect(body).toHaveProperty('user.email', emailVo);
      expect(headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringContaining('refreshToken=')]),
      );
    });
  });

  describe('/auth/revalidate (POST)', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(userPayload as LoginUserDto)
        .expect(HttpStatus.OK);

      const cookiesHeader = loginResponse.headers['set-cookie'];
      const cookies = Array.isArray(cookiesHeader)
        ? cookiesHeader
        : typeof cookiesHeader === 'string'
          ? cookiesHeader.split(',')
          : [];

      refreshToken = cookies
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0];
    });

    it('should return new access token and update refresh token cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/revalidate')
        .set('Cookie', [refreshToken])
        .expect(HttpStatus.OK);

      const body: RevalidateSessionResponseDto = response.body;
      const headers = response.headers;

      expect(body).toBeDefined();
      expect(body).toHaveProperty('accessToken');
      expect(headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringContaining('refreshToken=')]),
      );
    });
  });

  describe('/auth/logout (POST)', () => {
    let refreshToken: string;

    beforeAll(async () => {
      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send(userPayload)
        .expect(HttpStatus.OK);

      const cookiesHeader = loginResponse.headers['set-cookie'];
      const cookies = Array.isArray(cookiesHeader)
        ? cookiesHeader
        : typeof cookiesHeader === 'string'
          ? cookiesHeader.split(',')
          : [];

      refreshToken = cookies
        .find((cookie: string) => cookie.startsWith('refreshToken='))
        ?.split(';')[0];
    });

    it('should logout and clear the refresh token cookie', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/logout')
        .set('Cookie', [refreshToken])
        .expect(HttpStatus.OK);

      const headers = response.headers;
      const body: LogoutUserResponseDto = response.body;

      expect(body).toBeDefined();
      expect(body).toEqual({ message: 'Logged out successfully' });

      expect(headers['set-cookie']).toEqual(
        expect.arrayContaining([expect.stringMatching(/refreshToken=;/)]),
      );
    });
  });
});
