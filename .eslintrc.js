const { execFileSync } = require('child_process')
const pkgs = execFileSync('pnpm', ['--filter=./pkg', 'list', '--depth', '-1', '--no-color'], {
  cwd: __dirname,
})
  .toString('utf8')
  .split(/[\n\r]+/)
  .filter((line) => line)
  .map((line) => line.replace(/^@violet\/([^@]*)@.*/, '$1'))

module.exports = {
  root: true,
  ignorePatterns: ['!*.js', '!*.cjs', '!*.mjs', '!*.ts'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'import'],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': [2, { ignore: ['children'] }],
    complexity: ['error', 5],
    'max-depth': ['error', 1],
    'max-nested-callbacks': ['error', 3],
    'max-lines': ['error', 200],
    'prefer-template': 'error',
    'import/order': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'object-shorthand': [
      'error',
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: { '@typescript-eslint/no-var-requires': ['off'] },
    },
    ...pkgs.map((pkg) => ({
      files: [`pkg/${pkg}/**/*.js`, `pkg/${pkg}/**/*.ts`, `pkg/${pkg}/**/*.tsx`],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: [
              {
                group: ['.prisma/*'],
                message: `do not use .prisma/* instead use @prisma/*`,
              },
              {
                group: [
                  ...pkgs
                    .filter((pkg2) => pkg2 !== pkg && !['api', 'def', 'lib'].includes(pkg2))
                    .map((pkg2) => `@violet/${pkg2}`),
                  ...(pkg === 'api'
                    ? []
                    : [
                        '@violet/api/*',
                        '!@violet/api/api',
                        '@violet/api/api/*',
                        '!@violet/api/api/$api',
                      ]),
                ],
                message: `only allowed to import modules under @violet/${pkg}, @violet/def, @violet/lib and @violet/api/api/$api`,
              },
            ],
          },
        ],
      },
    })),
  ],
}
