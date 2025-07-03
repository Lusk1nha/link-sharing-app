import { HealthModule } from '../health.module';

describe(HealthModule.name, () => {
  let healthModule: HealthModule;

  beforeEach(() => {
    healthModule = new HealthModule();
  });

  it('should be defined', () => {
    expect(healthModule).toBeDefined();
  });
});
