import { PrismaService } from 'src/common/database/database.service';
import { ProfileService } from '../profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfileRepository } from '../profile.repository';
import { UPLOADER_STRATEGY } from 'src/common/file-uploader/domain/file-uploader.port';

describe(ProfileService.name, () => {
  let profileService: ProfileService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        ProfileRepository,
        {
          provide: UPLOADER_STRATEGY,
          useValue: {
            upload: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(profileService).toBeDefined();
    expect(prismaService).toBeDefined();
  });
});
