import { AdminModule } from '../admin.module';

describe(AdminModule.name, () => {
  let module: AdminModule;

  beforeEach(() => {
    module = new AdminModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
