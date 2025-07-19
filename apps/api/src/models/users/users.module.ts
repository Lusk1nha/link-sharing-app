import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/database/database.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import {
  RABBITMQ_CLIENT_CONFIG,
  RABBITMQ_MANAGER,
} from 'src/common/rabbitmq/domain/rabbitmq.injects';
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service';
import { rabbitMQConfig } from 'src/common/rabbitmq/rabbitmq.config';
import { RABBITMQ_CONSTANTS } from 'src/common/rabbitmq/rabbitmq.constants';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    PrismaService,

    {
      provide: RABBITMQ_MANAGER,
      useClass: RabbitMQService,
    },
    {
      provide: RABBITMQ_CLIENT_CONFIG,
      useValue: rabbitMQConfig({
        queue: RABBITMQ_CONSTANTS.USERS_QUEUE,
        queueOptions: { durable: false },
      }),
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
