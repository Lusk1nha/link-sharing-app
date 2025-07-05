import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from '../profile.controller';
import { ProfileService } from '../profile.service';
import { RolesModule } from 'src/models/roles/roles.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { generateSingleMockProfile } from '../__mock__/profile.mock';
import { ProfileMapper } from '../domain/profile.mapper';
import { JwtStoredPayload } from 'src/common/auth/__types__/auth.types';
import { generateSingleMockUser } from 'src/models/users/__mock__/users.mock';
import { Role } from 'src/common/roles/roles.common';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

describe(ProfileController.name, () => {
  let controller: ProfileController;
  let profileService: ProfileService;

  beforeAll(() => {
    process.env.HMAC_SECRET = 'ci-secret'; // ← define ANTES
    process.env.HMAC_ALGORITHM = 'sha256';
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        RolesModule,
        SessionsModule,
        CacheModule.register({
          isGlobal: true,
        }),
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
        }),
      ],
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            findUserById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(profileService).toBeDefined();
  });

  describe('getCurrentProfile', () => {
    it(`should be defined`, () => {
      expect(controller.getCurrentProfile).toBeDefined();
    });

    it('should return the current user profile', async () => {
      const mockUser = generateSingleMockUser();

      const mockProfile = generateSingleMockProfile();
      const profileEntity = ProfileMapper.toDomain(mockProfile);

      const jwtStoredPayload: JwtStoredPayload = {
        sub: mockProfile.id,
        email: mockUser.email,
        roles: [Role.User],
        aud: 'api',
        iss: 'auth',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      };

      jest
        .spyOn(profileService, 'findUserById')
        .mockResolvedValue(profileEntity);

      const result = await controller.getCurrentProfile(jwtStoredPayload);
      expect(result?.profile).toStrictEqual(profileEntity);
    });
  });

  describe('getProfileById', () => {
    it(`should be defined`, () => {
      expect(controller.getProfileById).toBeDefined();
    });

    it('should return the user profile by ID', async () => {
      const mockProfile = generateSingleMockProfile();
      const profileEntity = ProfileMapper.toDomain(mockProfile);

      const userIdPath = UUIDFactory.from(mockProfile.id);

      jest
        .spyOn(profileService, 'findUserById')
        .mockResolvedValue(profileEntity);

      const result = await controller.getProfileById(userIdPath);
      expect(result?.profile).toStrictEqual(profileEntity);
    });
  });
});
