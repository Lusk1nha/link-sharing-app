import { RolesModule } from '../roles.module';

describe(RolesModule.name, () => {
  let module: RolesModule;

  beforeEach(async () => {
    module = new RolesModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
