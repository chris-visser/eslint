require('@rushstack/eslint-patch/modern-module-resolution')

/** @type {import('eslint').ESLint.ConfigData}  */
module.exports = {
  parserOptions: {
    ecmaVersion: 'latest',
    parser: {
      js: 'espree',
      jsx: 'espree',

      ts: '@typescript-eslint/parser',
      tsx: '@typescript-eslint/parser'
    },
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    }
  },
  env: { node: true },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:vue/vue3-recommended'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.mts', '*.cts', '*.vue'],
      rules: {
        // The core 'no-unused-vars' rules (in the eslint:recommended ruleset)
        // does not work with type definitions.
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'warn'
      }
    },
    {
      // Include typescript eslint rules in *.vue files
      // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslint-recommended.ts
      files: ['*.vue'],
      rules: {
        'constructor-super': 'off', // ts(2335) & ts(2377)
        'getter-return': 'off', // ts(2378)
        'no-const-assign': 'off', // ts(2588)
        'no-dupe-args': 'off', // ts(2300)
        'no-dupe-class-members': 'off', // ts(2393) & ts(2300)
        'no-dupe-keys': 'off', // ts(1117)
        'no-func-assign': 'off', // ts(2539)
        'no-import-assign': 'off', // ts(2539) & ts(2540)
        'no-new-symbol': 'off', // ts(7009)
        'no-obj-calls': 'off', // ts(2349)
        'no-redeclare': 'off', // ts(2451)
        'no-setter-return': 'off', // ts(2408)
        'no-this-before-super': 'off', // ts(2376)
        'no-undef': 'off', // ts(2304)
        'no-unreachable': 'off', // ts(7027)
        'no-unsafe-negation': 'off', // ts(2365) & ts(2360) & ts(2358)
        'no-var': 'error', // ts transpiles let/const to var, so no need for vars any more
        'prefer-const': 'error', // ts provides better types with const
        'prefer-rest-params': 'error', // ts provides better types with rest args over arguments
        'prefer-spread': 'error', // ts transpiles spread to apply, so no need for manual apply
        'valid-typeof': 'off', // ts(2367)
      },
    },
    {
      // These pages are not used directly by users so they can have one-word names.
      files: [
        '**/pages/**/*.{js,ts,vue}',
        '**/layouts/**/*.{js,ts,vue}',
        '**/app.{js,ts,vue}',
        '**/error.{js,ts,vue}'
      ],
      rules: { 'vue/multi-word-component-names': 'off' }
    },
    {
      // Pages and layouts are required to have a single root element if transitions are enabled.
      files: ['**/pages/**/*.{js,ts,vue}', '**/layouts/**/*.{js,ts,vue}'],
      rules: { 'vue/no-multiple-template-root': 'error' }
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': [
          'error',
          {
            pathPattern: '^$',
            order: [
              'publisher',
              'name',
              'displayName',
              'type',
              'version',
              'private',
              'packageManager',
              'description',
              'author',
              'license',
              'funding',
              'homepage',
              'repository',
              'bugs',
              'keywords',
              'categories',
              'sideEffects',
              'exports',
              'main',
              'module',
              'unpkg',
              'jsdelivr',
              'types',
              'typesVersions',
              'bin',
              'icon',
              'files',
              'engines',
              'activationEvents',
              'contributes',
              'scripts',
              'peerDependencies',
              'peerDependenciesMeta',
              'dependencies',
              'optionalDependencies',
              'devDependencies',
              'pnpm',
              'overrides',
              'resolutions',
              'husky',
              'simple-git-hooks',
              'lint-staged',
              'eslintConfig',
            ],
          },
          {
            pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies$',
            order: { type: 'asc' },
          },
          {
            pathPattern: '^exports.*$',
            order: [
              'types',
              'require',
              'import',
            ],
          },
        ],
      },
    },
  ]
}
