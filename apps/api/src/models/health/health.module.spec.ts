import { HealthModule } from './health.module';

describe(HealthModule.name, () => {
  let healthModule: HealthModule;

  beforeEach(async () => {
    healthModule = new HealthModule();
  });

  it('should be defined', () => {
    expect(healthModule).toBeDefined();
  });
});
