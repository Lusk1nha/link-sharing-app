import { DynamicModule, Module } from '@nestjs/common';
import { MailValidator } from './mail.validator';
import { MailService } from './mail.service';
import { TEMPLATE_MAP, TemplateMap } from './domain/mail.port';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({})
export class MailModule {
  static forFeature(templateMap: TemplateMap): DynamicModule {
    return {
      module: MailModule,
      imports: [MailerModule],
      providers: [
        MailValidator,
        MailService,
        {
          provide: TEMPLATE_MAP,
          useValue: templateMap,
        },
      ],
      exports: [MailService],
    };
  }
}
