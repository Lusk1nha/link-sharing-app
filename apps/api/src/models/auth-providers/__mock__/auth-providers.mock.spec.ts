import {
  generateMockAuthProviders,
  generateSingleMockAuthProvider,
} from './auth-providers.mock';

describe('AuthProvider Mock Generator', () => {
  describe('generateMockAuthProviders', () => {
    it('should generate an array of AuthProvider mocks with default values', () => {
      const mocks = generateMockAuthProviders(3);
      expect(mocks).toHaveLength(3);
      mocks.forEach((mock) => {
        expect(mock).toHaveProperty('id');
        expect(mock).toHaveProperty('name');
        expect(mock).toHaveProperty('providerType');
        expect(mock).toHaveProperty('providerId');
        expect(mock).toHaveProperty('createdAt');
        expect(mock).toHaveProperty('updatedAt');
      });
    });

    it('should generate an array of AuthProvider mocks with overridden values', () => {
      const overrides = { providerId: 'custom-provider-id' };
      const mocks = generateMockAuthProviders(2, overrides);

      expect(mocks).toHaveLength(2);
      mocks.forEach((mock) => {
        expect(mock).toHaveProperty('id');
        expect(mock).toHaveProperty('providerType');
        expect(mock).toHaveProperty('providerId');
        expect(mock.providerId).toBe(overrides.providerId);
        expect(mock).toHaveProperty('createdAt');
        expect(mock).toHaveProperty('updatedAt');
      });
    });
  });

  describe('generateSingleMockAuthProvider', () => {
    it('should generate a single AuthProvider mock with default values', () => {
      const mock = generateSingleMockAuthProvider();
      expect(mock).toHaveProperty('id');
      expect(mock).toHaveProperty('name');
      expect(mock).toHaveProperty('providerType');
      expect(mock).toHaveProperty('providerId');
      expect(mock).toHaveProperty('createdAt');
      expect(mock).toHaveProperty('updatedAt');
    });

    it('should generate a single AuthProvider mock with overridden values', () => {
      const overrides = { providerId: 'custom-provider-id' };
      const mock = generateSingleMockAuthProvider(overrides);

      expect(mock).toHaveProperty('id');
      expect(mock).toHaveProperty('providerType');
      expect(mock).toHaveProperty('providerId');
      expect(mock.providerId).toBe(overrides.providerId);
      expect(mock).toHaveProperty('createdAt');
      expect(mock).toHaveProperty('updatedAt');
    });
  });
});
