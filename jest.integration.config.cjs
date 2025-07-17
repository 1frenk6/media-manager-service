module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globals: {},
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/setup-env.ts'],
  testMatch: ['**/test/integration/**/*.test.ts'],
};
