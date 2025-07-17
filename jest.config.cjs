module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globals: {},
  transform: {},
  extensionsToTreatAsEsm: ['.ts'],
  testPathIgnorePatterns: ['/dist/', '/test/integration'],
};
