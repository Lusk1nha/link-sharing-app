import { AdminModule } from './admin.module';

describe(AdminModule.name, () => {
  let module: AdminModule;

  beforeEach(async () => {
    module = new AdminModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
