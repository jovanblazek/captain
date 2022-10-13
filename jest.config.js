/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build/'],
  setupFilesAfterEnv: ['<rootDir>/src/utils/testing/prismaClientMock.ts'],
  moduleDirectories: ['node_modules', 'src'],
}
