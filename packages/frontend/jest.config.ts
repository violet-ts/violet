import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  setupFiles: ['./test/setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx$': 'babel-jest',
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
  },
  testMatch: ['<rootDir>/test/**/*.ts{,x}'],
}

export default config
