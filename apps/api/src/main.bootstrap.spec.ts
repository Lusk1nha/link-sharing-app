import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { setupApp } from './common/setup/app/app.setup';
import { setupSwagger } from './common/setup/swagger/swagger.setup';
import { Logger } from '@nestjs/common';
import { setupMicroservices } from './common/setup/microservices/microservices.setup';

jest.mock('@nestjs/core');
jest.mock('./common/setup/app/app.setup');
jest.mock('./common/setup/swagger/swagger.setup');
jest.mock('./common/setup/microservices/microservices.setup');
jest.mock('./common/rabbitmq/rabbitmq.config', () => ({
  rabbitMQConfig: jest.fn(() => ({
    transport: 'RMQ',
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'coupons_queue',
      queueOptions: { durable: false },
    },
  })),
}));

describe('Bootstrap initialization', () => {
  let exitSpy: jest.SpyInstance;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let listenMock: jest.Mock;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };

    // Spies
    exitSpy = jest
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
    logSpy = jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    errorSpy = jest
      .spyOn(Logger.prototype, 'error')
      .mockImplementation(() => {});

    // App mock
    listenMock = jest.fn().mockResolvedValue(undefined);
    const appMock = {
      listen: listenMock,
      connectMicroservice: jest.fn(),
      startAllMicroservices: jest.fn(),
    };

    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
    (setupApp as jest.Mock).mockResolvedValue(appMock);
    (setupMicroservices as jest.Mock).mockResolvedValue(undefined);
    (setupSwagger as jest.Mock).mockImplementation(() => {});
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(bootstrap).toBeDefined();
  });

  it('should listen on the correct port and log successes without Swagger in production', async () => {
    process.env.APP_PORT = '5000';
    process.env.NODE_ENV = 'production';

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalledWith(
      expect.any(Function),
      expect.any(Object),
    );
    expect(setupApp).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Logger),
    );

    expect(setupSwagger).not.toHaveBeenCalled();

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

  it('should setup swagger in development environment', async () => {
    process.env.APP_PORT = '3000';
    process.env.NODE_ENV = 'development';

    await bootstrap();

    expect(setupSwagger).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Logger),
    );
  });

  it('should log error and call process.exit(1) on failure', async () => {
    const startupError = new Error('startup failure');
    (NestFactory.create as jest.Mock).mockRejectedValueOnce(startupError);

    await bootstrap();

    expect(errorSpy).toHaveBeenCalledWith(
      '[bootstrap] Failed to start application',
      expect.any(String),
    );
    expect(exitSpy).toHaveBeenCalledWith(1);
  });
});
