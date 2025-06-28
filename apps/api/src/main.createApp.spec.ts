import { createApp } from './main';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupApp } from './common/setup/app/app.setup';
import { setupSwagger } from './common/setup/swagger/swagger.setup';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/core');
jest.mock('./common/setup/app/app.setup');
jest.mock('./common/setup/swagger/swagger.setup');

describe('Bootstrap createApp', () => {
  let mockApp: any;
  let logger: Logger;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApp = { listen: jest.fn() };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
    logger = new Logger('TestBootstrap');
    jest.spyOn(logger, 'log').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(createApp).toBeDefined();
  });

  it('should create an application with CORS enabled and setup app and swagger', async () => {
    const app = await createApp(logger);

    expect(NestFactory.create).toHaveBeenCalledWith(AppModule, { cors: true });
    expect(setupApp).toHaveBeenCalledWith(app, logger);
    expect(setupSwagger).toHaveBeenCalledWith(app, logger);
    expect(app).toBe(mockApp);
  });

  it('should fail to create an application and log the error', async () => {
    const error = new Error('create-fail');
    (NestFactory.create as jest.Mock).mockRejectedValue(error);
    await expect(createApp(logger)).rejects.toThrow(error);

    expect(logger.log).toHaveBeenCalledWith(
      '[bootstrap] Starting application...',
    );
  });
});
