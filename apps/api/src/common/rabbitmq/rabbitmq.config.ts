import { RmqOptions, Transport } from '@nestjs/microservices';

export const rabbitMQConfig = (options: RmqOptions['options']): RmqOptions => ({
  transport: Transport.RMQ,
  options: {
    urls: [process.env.RABBITMQ_URI || 'amqp://rabbitmq:5672'],
    ...(options ?? {}),
  },
});
