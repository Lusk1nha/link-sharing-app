import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { MailService } from 'src/common/mail/mail.service';
import { UserMapper } from '../users/domain/user.mapper';
import { AUTH_TEMPLATES } from './auth.templates';

@Controller()
export class AuthConsumer {
  private readonly logger = new Logger(AuthConsumer.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('auth.user.registered')
  async handleUserRegisteredEvent(user: User) {
    const userVo = UserMapper.toDomain(user);

    await this.mailService.send({
      template: AUTH_TEMPLATES.AUTH_WELCOME,
      to: [userVo.email],
      context: {
        user: userVo,
      },
    });
  }

  @EventPattern('auth.user.login')
  async handleUserLoginEvent(user: User) {
    const userVo = UserMapper.toDomain(user);

    await this.mailService.send({
      template: AUTH_TEMPLATES.AUTH_LOGIN,
      to: [userVo.email],
      context: {
        user: userVo,
        lastLogin: new Date().toLocaleString(),
      },
    });
  }
}
