import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { generateSingleMockProfile } from '../__mock__/profile.mock';
import { ProfileEntity } from '../domain/profile.entity';

describe(ProfileEntity.name, () => {
  it('should be defined', () => {
    expect(ProfileEntity).toBeDefined();
  });

  describe('constructor with valid data', () => {
    it('should create a new profile with valid data', () => {
      const rawProfile = generateSingleMockProfile();

      const profile = new ProfileEntity(
        UUIDFactory.from(rawProfile.id),
        UUIDFactory.from(rawProfile.userId),
        rawProfile.firstName,
        rawProfile.lastName,
        rawProfile.imageUrl ? rawProfile.imageUrl : undefined,
        rawProfile.createdAt,
        rawProfile.updatedAt,
      );

      expect(profile).toBeInstanceOf(ProfileEntity);
      expect(profile.id.value).toEqual(rawProfile.id);
      expect(profile.userId.value).toEqual(rawProfile.userId);
      expect(profile.firstName).toEqual(rawProfile.firstName);
      expect(profile.lastName).toEqual(rawProfile.lastName);
      expect(profile.imageUrl).toEqual(rawProfile.imageUrl);
      expect(profile.createdAt).toEqual(rawProfile.createdAt);
      expect(profile.updatedAt).toEqual(rawProfile.updatedAt);
    });
  });
});
