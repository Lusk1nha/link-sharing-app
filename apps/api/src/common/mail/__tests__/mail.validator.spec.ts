import { Test, TestingModule } from '@nestjs/testing';
import { MailValidator } from '../mail.validator';
import { MailerService } from '@nestjs-modules/mailer';
import { TemplateMap } from '../domain/mail.port';
import { TemplateNotFoundException } from '../mail.errors';

describe(MailValidator.name, () => {
  let validator: MailValidator;
  let mailerService: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MailerService,
          useValue: {
            verifyAllTransporters: jest.fn(),
          },
        },
        MailValidator,
      ],
    }).compile();

    validator = module.get<MailValidator>(MailValidator);
    mailerService = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
    expect(mailerService).toBeDefined();
  });

  describe(MailValidator.prototype.verifyTransporters.name, () => {
    it('should be defined', () => {
      expect(validator.verifyTransporters).toBeDefined();
    });

    it('should call verifyAllTransporters on init', async () => {
      jest
        .spyOn(mailerService, 'verifyAllTransporters')
        .mockResolvedValue(true);

      const result = await validator.verifyTransporters();

      expect(result).toBe(true);
      expect(mailerService.verifyAllTransporters).toHaveBeenCalled();
    });

    it('should return false if verifyAllTransporters fails', async () => {
      jest
        .spyOn(mailerService, 'verifyAllTransporters')
        .mockResolvedValue(false);

      const result = await validator.verifyTransporters();

      expect(result).toBe(false);
      expect(mailerService.verifyAllTransporters).toHaveBeenCalled();
    });
  });

  describe(MailValidator.prototype.resolveTemplate.name, () => {
    it('should be defined', () => {
      expect(validator.resolveTemplate).toBeDefined();
    });

    it('should return the template schema if found', () => {
      const templates = {
        'test-template': { name: 'test-template', subject: 'Test Subject' },
      } as TemplateMap;

      const result = validator.resolveTemplate(templates, 'test-template');

      expect(result).toEqual(templates['test-template']);
    });

    it('should throw TemplateNotFoundException if template not found', () => {
      const templates = {} as TemplateMap;

      expect(() =>
        validator.resolveTemplate(templates, 'non-existent'),
      ).toThrow(new TemplateNotFoundException('non-existent'));
    });
  });
});
