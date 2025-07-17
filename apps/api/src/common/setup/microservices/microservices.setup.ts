import { INestApplication, Logger } from '@nestjs/common';
import { MicroserviceOptions } from '@nestjs/microservices';
import { rabbitMQConfig } from 'src/common/rabbitmq/rabbitmq.config';
import { RABBITMQ_CONSTANTS } from 'src/common/rabbitmq/rabbitmq.constants';

export async function setupMicroservices(
  app: INestApplication,
  logger: Logger,
): Promise<void> {
  logger.log('[setupMicroservices] Initializing microservices setup...');

  app.connectMicroservice<MicroserviceOptions>(createAuthRabbitMQConfig());

  logger.log('[setupMicroservices] Connecting to RabbitMQ microservice...');

  await app.startAllMicroservices();

  logger.log(
    '[setupMicroservices] Microservices setup completed successfully.',
  );
}

function createAuthRabbitMQConfig() {
  return rabbitMQConfig({
    queue: RABBITMQ_CONSTANTS.AUTH_QUEUE,
    queueOptions: { durable: false },
  });
}
