import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { TemplateMap, TemplateSchema } from './domain/mail.port';
import { TemplateNotFoundException } from './mail.errors';

@Injectable()
export class MailValidator {
  private readonly logger = new Logger(MailValidator.name);

  constructor(private readonly mailer: MailerService) {}

  public async verifyTransporters(): Promise<boolean> {
    try {
      const result = await this.mailer.verifyAllTransporters();
      this.logger.log('SMTP transporters verified successfully');
      return result;
    } catch (error) {
      this.logger.error('Failed to verify SMTP transporters', error);
      return false;
    }
  }

  public resolveTemplate(templates: TemplateMap, name: string): TemplateSchema {
    const schema = templates[name];
    if (!schema) throw new TemplateNotFoundException(name);
    return schema;
  }
}
