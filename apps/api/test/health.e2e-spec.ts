import * as request from 'supertest';

import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';

describe('HealthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterEach(async () => await app.close());

  describe('GET health status /health', () => {
    it('GET /health/ready returns 200 OK', async () => {
      await request(app.getHttpServer())
        .get('/health/ready')
        .expect(HttpStatus.OK)
        .expect((res) => expect(res.body).toBeDefined());
    });

    it('GET /health/live returns 200 OK', async () => {
      await request(app.getHttpServer())
        .get('/health/live')
        .expect(HttpStatus.OK)
        .expect((res) => expect(res.body).toBeDefined());
    });
  });
});
