import { generateMockTokens, generateSingleMockToken } from './token.mock';

describe('Token Mock Generator', () => {
  describe('generateMockTokens', () => {
    it(`should be defined ${generateMockTokens.name}`, () => {
      expect(generateMockTokens).toBeDefined();
    });

    it('should generate the correct number of tokens', () => {
      const tokens = generateMockTokens(5);
      expect(tokens).toHaveLength(5);
      expect(tokens[0]).toHaveProperty('token');
      expect(tokens[0]).toHaveProperty('tokenType');
      expect(tokens[0]).toHaveProperty('expiresIn');
    });
  });

  describe('generateSingleMockToken', () => {
    it(`should be defined ${generateSingleMockToken.name}`, () => {
      expect(generateSingleMockToken).toBeDefined();
    });

    it('should generate a single token with default properties', () => {
      const token = generateSingleMockToken();
      expect(token).toHaveProperty('token');
      expect(token).toHaveProperty('tokenType');
      expect(token).toHaveProperty('expiresIn');
    });
  });
});
