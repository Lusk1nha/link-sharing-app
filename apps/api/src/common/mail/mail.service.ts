import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { EmailAddress } from '../entities/email-address/email-address.entity';
import { TEMPLATE_MAP, TemplateMap } from './domain/mail.port';
import { MailValidator } from './mail.validator';
import {
  MailEnvironmentVariableException,
  SendMailException,
} from './mail.errors';

export interface ISendOptions {
  template: keyof TemplateMap;
  to: EmailAddress[];
  context: ISendMailOptions['context'];
}

@Injectable()
export class MailService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MailService.name);
  private readonly fromAddress: string;

  constructor(
    private readonly mailer: MailerService,

    private readonly validator: MailValidator,

    @Inject(TEMPLATE_MAP)
    private readonly templates: TemplateMap,
  ) {
    const fromAddress = process.env.SMTP_FROM_ADDRESS;

    if (!fromAddress) {
      throw new MailEnvironmentVariableException('SMTP_FROM_ADDRESS');
    }
    this.fromAddress = fromAddress;
  }

  async onModuleInit() {
    this.logger.log('MailService initialized');
    this.logger.log(`Using SMTP from address: ${this.fromAddress}`);

    await this.validator.verifyTransporters();
  }

  onModuleDestroy() {
    this.logger.log('MailService is being destroyed');
  }

  async send({ template, to, context }: ISendOptions): Promise<void> {
    const { name } = this.validator.resolveTemplate(this.templates, template);

    try {
      const mailOptions = this.buildMailOptions(name, to, context);

      await this.mailer.sendMail(mailOptions);

      this.logger.log(`Email sent successfully using template: ${template}`);
    } catch (error) {
      this.handleError(error, template);
    }
  }

  private buildMailOptions(
    template: string,
    to: EmailAddress[],
    context: ISendMailOptions['context'],
  ): ISendMailOptions {
    return {
      to: to.map((email) => email.value),
      subject: this.templates[template].subject,
      template,
      from: this.fromAddress,
      context,
    };
  }

  private handleError(error: unknown, template: string): void {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const exception = new SendMailException(message);

    this.logger.error(
      `Failed to send email using template "${template}": ${message}`,
      exception.stack,
    );

    throw exception;
  }
}
