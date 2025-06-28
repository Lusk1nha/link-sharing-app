import { HashModule } from './hash.module';

describe(HashModule.name, () => {
  let hashModule: HashModule;

  beforeEach(() => {
    hashModule = new HashModule();
  });

  it('should be defined', () => {
    expect(hashModule).toBeDefined();
  });
});
