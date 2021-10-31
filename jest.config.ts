import type { Config } from '@jest/types'

const config: { projects: Config.InitialOptions[] } = {
  projects: [
    {
      setupFiles: ['./packages/frontend/test/setup.js'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.tsx$': 'babel-jest',
        '^.+\\.ts$': 'ts-jest',
      },
      moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/test/__mocks__/fileMock.js',
      },
      testMatch: ['<rootDir>/packages/frontend/test/**/*.ts{,x}'],
    },
    {
      preset: 'ts-jest',
      setupFiles: ['./packages/api/test/setup.js'],
      testEnvironment: 'node',
      testMatch: ['<rootDir>/packages/api/test/**/*.ts'],
    },
  ],
}

export default config
