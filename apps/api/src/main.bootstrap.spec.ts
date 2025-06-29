import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { setupApp } from './common/setup/app/app.setup';
import { setupSwagger } from './common/setup/swagger/swagger.setup';
import { Logger } from '@nestjs/common';

jest.mock('@nestjs/core');
jest.mock('./common/setup/app/app.setup');
jest.mock('./common/setup/swagger/swagger.setup');

describe('Bootstrap initialization', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let listenMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});
    listenMock = jest.fn().mockResolvedValue(undefined);
    (NestFactory.create as jest.Mock).mockResolvedValue({
      listen: listenMock,
    } as any);
  });

  it('should be defined', () => {
    expect(bootstrap).toBeDefined();
  });

  it('should listen on the correct port and log successes', async () => {
    process.env.APP_PORT = '5000';
    process.env.NODE_ENV = 'production';

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(expect.any(Function), {
      cors: true,
    });
    expect(setupApp).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Logger),
    );
    expect(setupSwagger).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Logger),
    );
    expect(listenMock).toHaveBeenCalledWith('5000', '0.0.0.0');

    expect(logSpy).toHaveBeenCalledWith('[bootstrap] Starting application...');
    expect(logSpy).toHaveBeenCalledWith(
      '[bootstrap] Application started successfully on port 5000',
    );
    expect(logSpy).toHaveBeenCalledWith(
      '[bootstrap] Application running on environment: production',
    );
    expect(exitSpy).not.toHaveBeenCalled();
  });

  it('should log error and call process.exit(1) on failure', async () => {
    const error = new Error('startup failure');
    (NestFactory.create as jest.Mock).mockRejectedValueOnce(error);

    await bootstrap();

    expect(errorSpy).toHaveBeenCalledWith(
      '[bootstrap] Failed to start application',
      expect.any(String),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
