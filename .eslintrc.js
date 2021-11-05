const pkgs = ['api', 'def', 'lambda', 'scripts', 'web']
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
  plugins: ['@typescript-eslint', 'react', 'prettier', 'import'],
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
    'prettier/prettier': ['error'],
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
                group: [
                  ...pkgs
                    .filter((pkg2) => pkg2 !== pkg && pkg2 !== 'api' && pkg2 !== 'def')
                    .map((pkg2) => `!@violet/${pkg2}`),
                  ...(pkg === 'api' ? [] : ['@violet/api/src/*']),
                ],
                message: `only allowed to import modules under @violet/${pkg}, @violet/def, @violet/api/api and @violet/api/types`,
              },
            ],
          },
        ],
      },
    })),
  ],
}
