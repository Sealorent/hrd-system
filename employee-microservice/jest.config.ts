import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest to support TypeScript
  testEnvironment: 'node', // The environment for running the tests (Node.js)
  verbose: true, // Show detailed test results
  setupFilesAfterEnv: ['./jest.setup.ts'], // Optional: Path to setup file for additional configuration
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Supported file extensions
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transform TypeScript files using ts-jest
  },
  testMatch: ['**/tests/**/*.test.ts'], // Match test files with .test.ts in the tests folder
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json', // Point to your tsconfig file for TypeScript configuration
    },
  },
};

export default config;
