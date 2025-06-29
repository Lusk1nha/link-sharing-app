import { AuthProviderModule } from '../auth-providers.module';

describe(AuthProviderModule, () => {
  let module: AuthProviderModule;

  beforeEach(async () => {
    module = new AuthProviderModule();
  });

  it(`#${AuthProviderModule.name} should be defined without errors when services loads`, async () => {
    expect(module).toBeDefined();
  });
});
