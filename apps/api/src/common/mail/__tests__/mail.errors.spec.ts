import {
  MailEnvironmentVariableException,
  SendMailException,
  TemplateNotFoundException,
} from '../mail.errors';

describe(MailEnvironmentVariableException.name, () => {
  it('should be defined', () => {
    expect(MailEnvironmentVariableException).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(
      new MailEnvironmentVariableException('SMTP_FROM_ADDRESS'),
    ).toBeInstanceOf(MailEnvironmentVariableException);
  });

  it('should have a message property', () => {
    const error = new MailEnvironmentVariableException('SMTP_FROM_ADDRESS');
    expect(error.getMessage()).toContain('SMTP_FROM_ADDRESS');
  });
});

describe(SendMailException.name, () => {
  it('should be defined', () => {
    expect(SendMailException).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(new SendMailException('Test error')).toBeInstanceOf(
      SendMailException,
    );
  });

  it('should have a message property', () => {
    const error = new SendMailException('Test error');
    expect(error.getMessage()).toContain('Test error');
  });
});

describe(TemplateNotFoundException.name, () => {
  it('should be defined', () => {
    expect(TemplateNotFoundException).toBeDefined();
  });

  it('should be instantiable', () => {
    expect(new TemplateNotFoundException('test-template')).toBeInstanceOf(
      TemplateNotFoundException,
    );
  });

  it('should have a message property', () => {
    const error = new TemplateNotFoundException('test-template');
    expect(error.getMessage()).toContain('Template test-template not found');
  });
});
