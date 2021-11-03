import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  setupFiles: ['./test/setup.js'],
  testEnvironment: 'node',
  testMatch: ['<rootDir>/test/**/*.ts'],
}

export default config
