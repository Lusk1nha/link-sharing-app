import { SessionsModule } from './sessions.module';

describe(SessionsModule.name, () => {
  let module: SessionsModule;

  beforeEach(() => {
    module = new SessionsModule();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
