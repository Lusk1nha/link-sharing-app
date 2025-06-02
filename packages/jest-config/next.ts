import type { Config } from "jest";

import nextJest from "next/jest";
import { config as baseConfig } from "./base";

const createJestConfig = nextJest({
  dir: "./",
});

const config = {
  ...baseConfig,
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  moduleFileExtensions: [...baseConfig.moduleFileExtensions, "jsx", "tsx"],

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
} as const satisfies Config;

export default createJestConfig(config);
