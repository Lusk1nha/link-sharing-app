import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { SendMailException, TemplateNotFoundException } from './mail.errors';
import { EmailAddress } from '../entities/email-address/email-address.entity';
import { TEMPLATE_MAP, TemplateMap, TemplateSchema } from './domain/mail.port';

export interface ISendOptions {
  template: keyof TemplateMap;
  to: EmailAddress[];
  context: ISendMailOptions['context'];
}

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private readonly fromAddress = process.env.SMTP_FROM;

  constructor(
    private readonly mailer: MailerService,
    @Inject(TEMPLATE_MAP)
    private readonly templates: TemplateMap,
  ) {}

  onModuleInit() {
    this.logger.log('MailService initialized');
  }

  async send({ template, to, context }: ISendOptions): Promise<void> {
    try {
      const { name, subject } = this.resolveTemplate(template);

      const mailOptions: ISendMailOptions = {
        to: to.map((email) => email.value),
        subject,
        template: name,
        from: this.fromAddress,
        context,
      };

      await this.mailer.sendMail(mailOptions);
      this.logger.log(`Email sent successfully using template: ${template}`);
    } catch (error) {
      this.handleError(error, template);
    }
  }

  private resolveTemplate(template: string): TemplateSchema {
    const schema = this.templates[template];
    if (!schema) throw new TemplateNotFoundException(template);
    return schema;
  }

  private handleError(error: unknown, template: string): void {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const exception = new SendMailException(message);
    this.logger.error(
      `Failed to send email using template "${template}": ${message}`,
      exception.stack,
    );
  }
}
