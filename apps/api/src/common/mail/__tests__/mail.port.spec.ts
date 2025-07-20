import { TEMPLATE_MAP, TemplateSchema } from '../domain/mail.port';

describe(TEMPLATE_MAP.toString(), () => {
  it('should be defined', () => {
    expect(TEMPLATE_MAP).toBeDefined();
  });

  it('should be a symbol', () => {
    expect(typeof TEMPLATE_MAP).toBe('symbol');
  });

  it('should have a descriptive name', () => {
    expect(TEMPLATE_MAP.toString()).toBe('Symbol(TEMPLATE_MAP)');
  });
});

describe('TemplateSchema', () => {
  it('should have a name property', () => {
    const schema: TemplateSchema = {
      name: 'test-template',
      subject: 'Test Subject',
    };
    expect(schema.name).toBeDefined();
    expect(schema.name).toBe('test-template');
  });

  it('should have a subject property', () => {
    const schema: TemplateSchema = {
      name: 'test-template',
      subject: 'Test Subject',
    };
    expect(schema.subject).toBeDefined();
    expect(schema.subject).toBe('Test Subject');
  });
});
