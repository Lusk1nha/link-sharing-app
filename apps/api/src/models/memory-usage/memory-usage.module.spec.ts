import { MemoryUsageModule } from './memory-usage.module';

describe(MemoryUsageModule.name, () => {
  let memoryModule: MemoryUsageModule;

  beforeEach(() => {
    memoryModule = new MemoryUsageModule();
  });

  it('should be defined', () => {
    expect(memoryModule).toBeDefined();
  });
});
