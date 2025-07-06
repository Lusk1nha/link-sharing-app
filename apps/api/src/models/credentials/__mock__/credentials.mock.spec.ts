import {
  generateMockCredentials,
  generateSingleMockCredential,
} from './credentials.mock';

describe('Credential Mock Generator', () => {
  describe('generateMockCredentials', () => {
    it(`should be defined ${generateMockCredentials.name}`, () => {
      expect(generateMockCredentials).toBeDefined();
    });

    it('should generate the correct number of credentials', () => {
      const credentials = generateMockCredentials(5);
      expect(credentials).toHaveLength(5);
      expect(credentials[0]).toHaveProperty('id');
      expect(credentials[0]).toHaveProperty('userId');
      expect(credentials[0]).toHaveProperty('passwordHash');
      expect(credentials[0]).toHaveProperty('createdAt');
      expect(credentials[0]).toHaveProperty('updatedAt');
    });

    it('should generate credentials with overridden properties', () => {
      const overrides = { userId: 'custom-user-id' };
      const credentials = generateMockCredentials(3, overrides);
      expect(credentials).toHaveLength(3);
      credentials.forEach((credential) => {
        expect(credential.userId).toBe(overrides.userId);
      });
    });
  });

  describe('generateSingleMockCredential', () => {
    it(`should be defined ${generateSingleMockCredential.name}`, () => {
      expect(generateSingleMockCredential).toBeDefined();
    });

    it('should generate a single credential with default properties', () => {
      const credential = generateSingleMockCredential();
      expect(credential).toHaveProperty('id');
      expect(credential).toHaveProperty('userId');
      expect(credential).toHaveProperty('passwordHash');
      expect(credential).toHaveProperty('createdAt');
      expect(credential).toHaveProperty('updatedAt');
    });

    it('should generate a single credential with overridden properties', () => {
      const overrides = { userId: 'custom-user-id' };
      const credential = generateSingleMockCredential(overrides);
      expect(credential.userId).toBe(overrides.userId);
    });
  });
});
