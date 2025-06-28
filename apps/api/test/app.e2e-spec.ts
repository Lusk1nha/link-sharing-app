import * as request from 'supertest';

import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from 'src/app/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.APP_NAME = 'MyApp';
    process.env.APP_DESCRIPTION = 'This is my app';
    process.env.APP_VERSION = '2.3.4';
    process.env.NODE_ENV = 'test';
    process.env.DOCS_URL = 'http://test.docs.local';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get: (key: string, defaultValue?: string) => {
          if (defaultValue !== undefined) {
            return process.env[key] ?? defaultValue;
          }

          if (process.env[key] === undefined) {
            return undefined;
          }

          return process.env[key];
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => await app.close());

  it('GET / returns the proper index payload', async () => {
    const expected = {
      name: 'MyApp',
      description: 'This is my app',
      version: '2.3.4',
      environment: 'test',
      authors: ['Lucas Pedro da Hora <lucaspedro517@gmail.com>'],
      docsUrl: 'http://test.docs.local',
    };

    await request(app.getHttpServer())
      .get('/')
      .expect(HttpStatus.OK)
      .expect((res) => expect(res.body).toEqual(expected));
  });
});
