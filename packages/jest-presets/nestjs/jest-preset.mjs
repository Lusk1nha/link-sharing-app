/** @type {import('jest').Config} */
const config = {
  rootDir: 'src',
  collectCoverage: true,
  coverageProvider: 'v8',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^@link-sharing-app/(.*)$': '<rootDir>/node_modules/@link-sharing-app/$1',
  },
};

export default config;
