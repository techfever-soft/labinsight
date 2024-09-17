
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^@cli/(.*)$": "<rootDir>/src/cli/$1",
    "^@core/(.*)$": "<rootDir>/src/core/$1",
    "^@interfaces/(.*)$": "<rootDir>/src/interfaces/$1",
    "^@utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@config/(.*)$": "<rootDir>/src/config/$1",
    "^@languages/(.*)$": "<rootDir>/src/languages/$1",
    "^@lab-types/(.*)$": "<rootDir>/src/types/$1",
    "^@loaders/(.*)$": "<rootDir>/src/loaders/$1"
  },
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};