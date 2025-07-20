import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  RmqOptions,
} from '@nestjs/microservices';
import { RABBITMQ_CLIENT_CONFIG } from './domain/rabbitmq.injects';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  private readonly client: ClientProxy;

  constructor(@Inject(RABBITMQ_CLIENT_CONFIG) config: RmqOptions) {
    this.client = ClientProxyFactory.create(config);
  }

  publish<T>(key: string, data: T): void {
    this.client.emit<T>(key, data);

    this.logger.debug(`Published message to ${key}, ${JSON.stringify(data)}`);
  }
}
