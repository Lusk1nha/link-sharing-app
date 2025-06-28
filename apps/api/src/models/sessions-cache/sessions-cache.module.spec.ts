import { SessionsCacheModule } from './sessions-cache.module';

describe(SessionsCacheModule.name, () => {
  let module: SessionsCacheModule;

  beforeEach(() => {
    module = new SessionsCacheModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
