import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { setupApp } from './common/setup/app/app.setup';
import { setupSwagger } from './common/setup/swagger/swagger.setup';
import { Logger, INestApplication } from '@nestjs/common';

export async function createApp(
  logger = new Logger('Bootstrap'),
): Promise<INestApplication> {
  logger.log('[bootstrap] Starting application...');

  const app = await NestFactory.create(AppModule, { cors: true });

  setupApp(app, logger);
  setupSwagger(app, logger);

  return app;
}

export async function bootstrap(): Promise<void> {
  const port = process.env.APP_PORT ?? '3000';
  const environment = process.env.NODE_ENV ?? 'development';
  const logger = new Logger('Bootstrap');

  try {
    const app = await createApp(logger);
    await app.listen(port, '0.0.0.0');

    logger.log(`[bootstrap] Application started successfully on port ${port}`);
    logger.log(
      `[bootstrap] Application running on environment: ${environment}`,
    );
  } catch (err) {
    logger.error('[bootstrap] Failed to start application', err.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}
