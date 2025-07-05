import {
  generateMockProfiles,
  generateSingleMockProfile,
} from './profile.mock';

describe('Profile Mock Generator', () => {
  describe('generateMockProfiles', () => {
    it('should be defined', () => {
      expect(generateMockProfiles).toBeDefined();
    });

    it('should generate the correct number of profiles', () => {
      const profiles = generateMockProfiles(5);
      expect(profiles).toHaveLength(5);
      expect(profiles[0]).toHaveProperty('id');
      expect(profiles[0]).toHaveProperty('userId');
      expect(profiles[0]).toHaveProperty('firstName');
      expect(profiles[0]).toHaveProperty('lastName');
      expect(profiles[0]).toHaveProperty('imageUrl');
      expect(profiles[0]).toHaveProperty('createdAt');
      expect(profiles[0]).toHaveProperty('updatedAt');
    });
  });

  describe('generateSingleMockProfile', () => {
    it('should be defined', () => {
      expect(generateSingleMockProfile).toBeDefined();
    });

    it('should generate a single profile with default properties', () => {
      const profile = generateSingleMockProfile();
      expect(profile).toHaveProperty('id');
      expect(profile).toHaveProperty('userId');
      expect(profile).toHaveProperty('firstName');
      expect(profile).toHaveProperty('lastName');
      expect(profile).toHaveProperty('imageUrl');
      expect(profile).toHaveProperty('createdAt');
      expect(profile).toHaveProperty('updatedAt');
    });
  });
});
