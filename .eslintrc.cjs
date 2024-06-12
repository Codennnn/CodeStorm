const { TYPESCRIPT_FILES } = require('prefer-code-style/constants')

module.exports = {
  root: true,

  extends: [require.resolve('prefer-code-style/eslint/preset/next')],

  rules: {
    'tailwindcss/no-custom-classname': 0,
    'import/no-unresolved': [2, { ignore: ['^\\~/'] }],
    '@next/next/no-img-element': 0,
  },

  overrides: [
    {
      files: TYPESCRIPT_FILES,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-unsafe-argument': 0,
      },
    },
  ],
}
