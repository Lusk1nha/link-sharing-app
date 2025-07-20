import { MailerService } from '@nestjs-modules/mailer';
import { ISendOptions, MailService } from '../mail.service';
import { MailValidator } from '../mail.validator';
import { Test, TestingModule } from '@nestjs/testing';
import { TEMPLATE_MAP, TemplateMap } from '../domain/mail.port';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { faker } from '@faker-js/faker/.';
import { SendMailException, TemplateNotFoundException } from '../mail.errors';

describe(MailService.name, () => {
  let service: MailService;
  let validator: MailValidator;
  let mailerService: MailerService;

  const OLD_ENV = process.env;

  const templateMap: TemplateMap = {
    'test-template': {
      name: 'test-template',
      subject: 'Test Subject',
    },
    'another-template': {
      name: 'another-template',
      subject: 'Another Test Subject',
    },
  };

  beforeAll(() => {
    process.env = { ...OLD_ENV, SMTP_FROM_ADDRESS: 'test@example.com' };
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailService,
        MailValidator,

        {
          provide: TEMPLATE_MAP,
          useValue: templateMap,
        },

        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn(),
            verifyAllTransporters: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
    validator = module.get<MailValidator>(MailValidator);
    mailerService = module.get<MailerService>(MailerService);
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(validator).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe(MailService.prototype.send.name, () => {
    it('should be defined', () => {
      expect(service.send).toBeDefined();
    });

    it('should send an email using the specified template', async () => {
      const email = EmailAddressFactory.from(faker.internet.email());

      const mailOptions: ISendOptions = {
        template: 'test-template',
        to: [email],
        context: {},
      };

      jest.spyOn(validator, 'resolveTemplate').mockReturnValue({
        name: 'test-template',
        subject: 'Test Subject',
      });
      jest.spyOn(mailerService, 'sendMail').mockResolvedValue(undefined);

      await service.send(mailOptions);

      expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
      expect(validator.resolveTemplate).toHaveBeenCalledWith(
        templateMap,
        'test-template',
      );
    });

    it('should throw an error if the template is not found', async () => {
      const email = EmailAddressFactory.from(faker.internet.email());

      const mailOptions: ISendOptions = {
        template: 'non-existent',
        to: [email],
        context: {},
      };

      await expect(service.send(mailOptions)).rejects.toThrow(
        new TemplateNotFoundException('non-existent'),
      );
    });

    it('should handle errors when sending email', async () => {
      const email = EmailAddressFactory.from(faker.internet.email());

      const mailOptions: ISendOptions = {
        template: 'test-template',
        to: [email],
        context: {},
      };

      jest.spyOn(validator, 'resolveTemplate').mockReturnValue({
        name: 'test-template',
        subject: 'Test Subject',
      });

      jest
        .spyOn(mailerService, 'sendMail')
        .mockRejectedValue(new Error('SMTP error'));

      await expect(service.send(mailOptions)).rejects.toThrow(
        new SendMailException('SMTP error'),
      );
    });
  });
});
