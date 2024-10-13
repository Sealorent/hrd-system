import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Use ts-jest to support TypeScript
  testEnvironment: 'node', // The environment for running the tests (Node.js)
  verbose: true, // Show detailed test results
  setupFilesAfterEnv: ['./jest.setup.ts'], // Optional: Path to setup file for additional configuration
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Supported file extensions
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }], // Define ts-jest configuration here
  },
  testMatch: ['**/_tests_/**/*.test.ts'], // Match test files with .test.ts in the tests folder
};

export default config;
