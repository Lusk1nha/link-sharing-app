import { PasswordModule } from './password.module';

describe(PasswordModule.name, () => {
  let module: PasswordModule;

  beforeEach(() => {
    module = new PasswordModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
