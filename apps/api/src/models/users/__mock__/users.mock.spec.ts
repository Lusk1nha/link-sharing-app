import { generateMockUsers, generateSingleMockUser } from './users.mock';

describe('User Mock Generator', () => {
  describe('generateMockUsers', () => {
    it(`should be defined ${generateMockUsers.name}`, () => {
      expect(generateMockUsers).toBeDefined();
    });

    it('should generate the correct number of users', () => {
      const users = generateMockUsers(5);
      expect(users).toHaveLength(5);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('createdAt');
      expect(users[0]).toHaveProperty('updatedAt');
    });
  });

  describe('generateSingleMockUser', () => {
    it(`should be defined ${generateSingleMockUser.name}`, () => {
      expect(generateSingleMockUser).toBeDefined();
    });

    it('should generate a single user with default properties', () => {
      const user = generateSingleMockUser();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('updatedAt');
    });
  });
});
