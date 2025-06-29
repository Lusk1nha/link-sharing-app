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
): void {
  logger.log('[setupApp] Initializing application setup...');

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  ); // Use global validation pipe for request validation

  app.setGlobalPrefix('api/v1'); // Set global prefix for all routes
  app.enableCors({
    origin: config?.origins || '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  }); // Enable CORS with default or provided origins

  app.use(helmet()); // Use Helmet for security headers
  app.use(cookieParser()); // Parse cookies in requests

  app.enableShutdownHooks(); // Enable shutdown hooks for graceful shutdown

  logger.log('[setupApp] Application setup completed successfully.');
}
