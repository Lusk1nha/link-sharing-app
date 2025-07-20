import { INestApplication, Logger, ValidationPipe } from '@nestjs/common';

import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

interface IApplicationConfig {
  origins?: string[];
}

export function setupApp(
  app: INestApplication,
  logger: Logger,
  config?: IApplicationConfig,
) {
  logger.log('[setupApp] Initializing application setup...');

  setupRoutesConfig(app, config);
  setupSecurity(app);

  app.enableShutdownHooks();

  logger.log('[setupApp] Application setup completed successfully.');

  return app;
}

function setupRoutesConfig(
  app: INestApplication,
  config?: IApplicationConfig,
): void {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: config?.origins || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
}

function setupSecurity(app: INestApplication): void {
  app.use(helmet());
  app.use(cookieParser());
}
