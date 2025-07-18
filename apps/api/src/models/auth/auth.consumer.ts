import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { User } from '@prisma/client';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { MailService } from 'src/common/mail/mail.service';

@Controller()
export class AuthConsumer {
  private readonly logger = new Logger(AuthConsumer.name);

  constructor(private readonly mailService: MailService) {}

  @EventPattern('auth.user.registered')
  async handleUserRegisteredEvent(data: User) {
    await this.mailService.send({
      template: 'auth-welcome',
      to: [EmailAddressFactory.from('lucaspedro517@gmail.com')],
      context: {
        user: data,
      },
    });
  }

  @EventPattern('auth.user.login')
  async handleUserLoginEvent(data: User) {
    await this.mailService.send({
      template: 'auth-login',
      to: [EmailAddressFactory.from('lucaspedro517@gmail.com')],
      context: {
        user: data,
        lastLogin: new Date().toLocaleString(),
      },
    });
  }
}
