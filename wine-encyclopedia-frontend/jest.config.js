module.exports = {
  preset: 'jest-preset-angular',
  globalSetup: 'jest-preset-angular/global-setup',
  testMatch: ['**/__tests__/**/*.spec.ts', '**/*.spec.ts'],
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  transform: {
    '^.+\\.(ts|js|html)$': 'jest-preset-angular',
  },
  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^.+\\.html$': '<rootDir>/src/__mocks__/htmlMock.js',
    '^.+\\.css$': '<rootDir>/src/__mocks__/styleMock.js'
  },
  testEnvironment: 'jsdom',
};
