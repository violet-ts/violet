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
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:eslint-comments/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
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
  rules: {
    'react/function-component-definition': ['error', { namedComponents: 'arrow-function' }],
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/self-closing-comp': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'eslint-comments/disable-enable-pair': 'off',
    'eslint-comments/no-unused-disable': 'error',
    'eslint-comments/require-description': 'error',
    'eslint-comments/no-use': ['error', { allow: ['eslint-disable', 'eslint-disable-next-line'] }],
    complexity: ['error', 5],
    'max-depth': ['error', 1],
    'max-nested-callbacks': ['error', 3],
    'max-lines': ['error', 200],
    'prefer-template': 'error',
    'import/order': 'off',
    'consistent-return': 'error',
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
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        sourceType: 'module',
        project: 'tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-floating-promises': 'error',
        '@typescript-eslint/no-implicit-any-catch': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      files: [
        '**/test/**/*',
        '**/tests/**/*',
        '**/__test__/**/*',
        '**/__tests__/**/*',
        '*.test.*',
        '*.spec.*',
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
      },
    },
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
                group: ['firebase/*'],
                message: `do not directly import firebase/* instead use src/utils/firebase`,
              },
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
