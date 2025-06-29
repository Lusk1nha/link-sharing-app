import { Test, TestingModule } from '@nestjs/testing';
import { AuthProviderService } from '../auth-providers.service';
import { PrismaService } from 'src/common/database/database.service';

describe(AuthProviderService, () => {
  let service: AuthProviderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthProviderService,
        {
          provide: PrismaService,
          useValue: {
            authProvider: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthProviderService>(AuthProviderService);
  });

  it(`#${AuthProviderService.name} should be defined without errors when services loads`, async () => {
    expect(service).toBeDefined();
  });
});
