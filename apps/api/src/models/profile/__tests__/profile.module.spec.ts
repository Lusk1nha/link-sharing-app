import { ProfileModule } from '../profile.module';

describe(ProfileModule.name, () => {
  let module: ProfileModule;

  beforeEach(() => {
    module = new ProfileModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
