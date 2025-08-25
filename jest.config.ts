// jest.config.ts
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // path to your Next.js app
});

const customJestConfig = {
  testEnvironment: 'jsdom',
  // Run this file before tests to set up RTL matchers & mocks
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Support TS/JS path aliases like @/components
    '^@/(.*)$': '<rootDir>/src/$1',

    // Handle CSS/Tailwind modules (identity-obj-proxy keeps className lookups harmless)
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^.+\\.(css|sass|scss)$': '<rootDir>/test/__mocks__/styleMock.js',

    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|svg)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testMatch: ['**/__tests__/**/*.(spec|test).(ts|tsx|js|jsx)'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/_*.{ts,tsx,js,jsx}', // skip Next special files if you want
  ],
};

export default createJestConfig(customJestConfig);
