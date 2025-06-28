import { CredentialsModule } from './credentials.module';

describe(CredentialsModule.name, () => {
  let module: CredentialsModule;

  beforeEach(async () => {
    module = new CredentialsModule();
  });

  it(`#${CredentialsModule.name} should be defined without errors when services loads`, async () => {
    expect(module).toBeDefined();
  });
});
