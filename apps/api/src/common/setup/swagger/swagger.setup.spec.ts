import { INestApplication, Logger } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';

import { setupSwagger } from './swagger.setup';

jest.mock('src/common/swagger/swagger.common', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => ({
    config: jest.fn().mockReturnValue({}),
    tag: 'TestTag',
  })),
}));

describe('setupSwagger', () => {
  let app: INestApplication;
  let logger: Logger;
  let createDocSpy: jest.SpyInstance;
  let setupSpy: jest.SpyInstance;
  let fakeDocument: object;

  beforeEach(() => {
    app = {} as any;
    logger = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    } as any;

    fakeDocument = { foo: 'bar' };
    createDocSpy = jest
      .spyOn(SwaggerModule, 'createDocument')
      .mockReturnValue(fakeDocument as any);
    setupSpy = jest.spyOn(SwaggerModule, 'setup').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls logger.log, createDocument and setup with correct arguments', () => {
    setupSwagger(app, logger);

    expect(logger.log).toHaveBeenCalledWith(
      '[setupSwagger] Initializing Swagger documentation setup...',
    );
    expect(createDocSpy).toHaveBeenCalledWith(app, {});
    expect(setupSpy).toHaveBeenCalledWith('TestTag', app, fakeDocument, {
      swaggerOptions: {
        persistAuthorization: false,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: 'Link Sharing API Docs',
      jsonDocumentUrl: 'api-docs/json',
    });
    expect(logger.log).toHaveBeenCalledWith(
      '[setupSwagger] Swagger documentation setup completed successfully.',
    );
  });
});
