import { RedisCacheModule } from '../redis-cache.module';

describe(RedisCacheModule.name, () => {
  let module: RedisCacheModule;

  beforeEach(() => {
    module = new RedisCacheModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
