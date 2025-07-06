import type { Config } from 'jest';

const nextJest = require('next/jest');
const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: 'v8',

  // An array of file extensions your modules use
  moduleFileExtensions: [
    'js',
    'mjs',
    'cjs',
    'jsx',
    'ts',
    'mts',
    'cts',
    'tsx',
    'json',
    'node',
  ],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|sass|scss|less)$': 'identity-obj-proxy',
    '^@link-sharing-app/(.*)$': '<rootDir>/../../packages/$1/src',
  },

  // The test environment that will be used for testing
  testEnvironment: 'jest-environment-jsdom',

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest',
  },
};

export default createJestConfig(config);
