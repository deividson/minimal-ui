module.exports = {
  parser: '@babel/eslint-parser',
  extends: [
    'eslint-config-airbnb',
  ],
  env: {
    node: true,
    browser: true,
    jest: true,
  },
  settings: {
    react: {
      pragma: 'h',
    },
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
  },
  globals: {
    gtag: true,
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: ['./tests/**/*.js', './jest/**/*.js', './webpack/**/*.js', './**/*.acceptance.js', './**/*.test.js'] }],
    'max-len': 'off',
    'no-underscore-dangle': [2, { allowAfterThis: true }],
    'no-plusplus': 'off',
    'no-return-await': 'off',
    semi: ['error', 'never'],
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': 'off',
    'react/no-unknown-property': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/prop-types': 'off',
    'react/function-component-definition': 'off',
  },
}
