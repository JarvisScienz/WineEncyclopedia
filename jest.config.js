export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/__tests__/**/*.test.ts'],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    globals: {
      'ts-jest': {
        tsconfig: 'tsconfig.test.json',
      },
    },
  };
  