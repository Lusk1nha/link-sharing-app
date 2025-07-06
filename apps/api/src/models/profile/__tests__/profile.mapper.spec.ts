import { generateSingleMockProfile } from '../__mock__/profile.mock';
import { ProfileMapper } from '../domain/profile.mapper';

describe(ProfileMapper.name, () => {
  it('should be defined', () => {
    expect(ProfileMapper).toBeDefined();
  });

  describe('toDomain', () => {
    it('should map raw profile to domain entity', () => {
      const rawProfile = generateSingleMockProfile();

      const profileEntity = ProfileMapper.toDomain(rawProfile);

      expect(profileEntity).toBeDefined();
      expect(profileEntity.id.value).toEqual(rawProfile.id);
      expect(profileEntity.userId.value).toEqual(rawProfile.userId);
      expect(profileEntity.firstName).toEqual(rawProfile.firstName);
      expect(profileEntity.lastName).toEqual(rawProfile.lastName);
      expect(profileEntity.imageUrl).toEqual(rawProfile.imageUrl);
      expect(profileEntity.createdAt).toEqual(rawProfile.createdAt);
      expect(profileEntity.updatedAt).toEqual(rawProfile.updatedAt);
    });
  });

  describe('toModel', () => {
    it('should map domain entity to raw profile', () => {
      const rawProfile = generateSingleMockProfile();
      const profileEntity = ProfileMapper.toDomain(rawProfile);

      const mappedRawProfile = ProfileMapper.toModel(profileEntity);

      expect(mappedRawProfile).toBeDefined();
      expect(mappedRawProfile.id).toEqual(profileEntity.id.value);
      expect(mappedRawProfile.userId).toEqual(profileEntity.userId.value);
      expect(mappedRawProfile.firstName).toEqual(profileEntity.firstName);
      expect(mappedRawProfile.lastName).toEqual(profileEntity.lastName);
      expect(mappedRawProfile.imageUrl).toEqual(profileEntity.imageUrl);
      expect(mappedRawProfile.createdAt).toEqual(profileEntity.createdAt);
      expect(mappedRawProfile.updatedAt).toEqual(profileEntity.updatedAt);
    });
  });
});
