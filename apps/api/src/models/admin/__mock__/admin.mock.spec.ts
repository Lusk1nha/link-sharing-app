import { generateMockAdmins, generateSingleMockAdmin } from './admin.mock';

describe('Admin Mock Generator', () => {
  describe('generateMockAdmins', () => {
    it(`should be defined ${generateMockAdmins.name}`, () => {
      expect(generateMockAdmins).toBeDefined();
    });

    it('should generate the correct number of admins', () => {
      const admins = generateMockAdmins(5);
      expect(admins).toHaveLength(5);
      expect(admins[0]).toHaveProperty('id');
      expect(admins[0]).toHaveProperty('userId');
      expect(admins[0]).toHaveProperty('createdAt');
      expect(admins[0]).toHaveProperty('updatedAt');
    });
  });

  describe('generateSingleMockAdmin', () => {
    it(`should be defined ${generateSingleMockAdmin.name}`, () => {
      expect(generateSingleMockAdmin).toBeDefined();
    });

    it('should generate a single admin with default properties', () => {
      const admin = generateSingleMockAdmin();
      expect(admin).toHaveProperty('id');
      expect(admin).toHaveProperty('userId');
      expect(admin).toHaveProperty('createdAt');
      expect(admin).toHaveProperty('updatedAt');
    });
  });
});
