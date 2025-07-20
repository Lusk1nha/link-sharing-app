import { TemplateMap } from '../domain/mail.port';
import { MailModule } from '../mail.module';

describe(MailModule, () => {
  let module: MailModule;

  const templateMap: TemplateMap = {
    'test-template': {
      name: 'test-template',
      subject: 'Test Subject',
    },
  };

  beforeEach(() => {
    module = MailModule.forFeature(templateMap);
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
