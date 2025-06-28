import { TokenModule } from './token.module';

describe(TokenModule.name, () => {
  let module: TokenModule;

  beforeEach(() => {
    module = new TokenModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
