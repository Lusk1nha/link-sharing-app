import { AuthModule } from '../auth.module';

describe(AuthModule.name, () => {
  let module: AuthModule;

  beforeEach(() => {
    module = new AuthModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
