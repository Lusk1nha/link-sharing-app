import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/database/database.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { CredentialsModule } from '../credentials/credentials.module';
import { PasswordModule } from '../password/password.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthProviderModule } from '../auth-providers/auth-providers.module';
import {
  RABBITMQ_CLIENT_CONFIG,
  RABBITMQ_MANAGER,
} from 'src/common/rabbitmq/domain/rabbitmq.injects';
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service';
import { rabbitMQConfig } from 'src/common/rabbitmq/rabbitmq.config';
import { RABBITMQ_CONSTANTS } from 'src/common/rabbitmq/rabbitmq.constants';
import { AuthConsumer } from './auth.consumer';
import { AuthValidatorService } from './auth.validator';
import { MailService } from 'src/common/mail/mail.service';
import { TEMPLATE_MAP } from 'src/common/mail/domain/mail.port';
import { AUTH_TEMPLATES_MAP } from './auth.templates';

@Module({
  imports: [
    UsersModule,
    CredentialsModule,
    AuthProviderModule,
    PasswordModule,
    SessionsModule,
  ],
  controllers: [AuthController, AuthConsumer],
  providers: [
    AuthService,
    AuthValidatorService,
    PrismaService,

    {
      provide: RABBITMQ_MANAGER,
      useClass: RabbitMQService,
    },
    {
      provide: RABBITMQ_CLIENT_CONFIG,
      useValue: rabbitMQConfig({
        queue: RABBITMQ_CONSTANTS.AUTH_QUEUE,
        queueOptions: { durable: false },
      }),
    },

    MailService,
    {
      provide: TEMPLATE_MAP,
      useValue: AUTH_TEMPLATES_MAP,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
