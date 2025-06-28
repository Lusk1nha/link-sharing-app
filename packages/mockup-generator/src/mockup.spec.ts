import { faker } from '@faker-js/faker';
import { generateMock, generateSingleMock } from './mockup';

describe('Mockup Generator', () => {
  describe(generateMock.name, () => {
    it(`should be defined ${generateMock.name}`, () => {
      expect(generateMock).toBeDefined();
    });

    it('should generate an array with 10 mock objects', () => {
      const MOCKS_COUNT = 10;

      const mock = generateMock(
        () => ({
          name: 'Test Name',
        }),
        MOCKS_COUNT,
      );

      expect(mock).toBeDefined();
      expect(mock).toHaveLength(MOCKS_COUNT);
    });

    it('should generate a mock object with default properties', () => {
      const mock = generateMock(
        () => ({
          name: faker.person.fullName(),
          email: faker.internet.email(),
        }),
        1,
      );

      expect(mock[0]).toHaveProperty('name');
      expect(mock[0]).toHaveProperty('email');
    });
  });

  describe(generateSingleMock.name, () => {
    it(`should be defined ${generateSingleMock.name}`, () => {
      expect(generateSingleMock).toBeDefined();
    });

    it('should generate a single mock object with default properties', () => {
      const mock = generateSingleMock(() => ({
        name: 'Test Name',
      }));

      expect(mock).toBeDefined();
      expect(mock).toHaveProperty('name', 'Test Name');
    });

    it('should generate a single mock object with overrides', () => {
      const override = { name: 'Overridden Name' };

      const mock = generateSingleMock(
        () => ({
          name: 'Test Name',
        }),
        override,
      );

      expect(mock).toBeDefined();
      expect(mock).toHaveProperty('name', 'Overridden Name');
    });
  });
});
