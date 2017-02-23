module.exports = {
  'extends': 'airbnb',
  'plugins': [
    'react',
    'jsx-a11y',
    'import'
  ],
  'rules': {
    'arrow-parens': 'off',
    'global-require': 'off',
    'max-len': ['error', 120],
    'no-use-before-define': 'off',
    'object-curly-spacing': 'off',
    'quote-props': 'off',
    'comma-dangle': [
      'error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'ignore',
      }
    ],
    'react/prop-types': 'off',
    'react/sort-comp': 'off',
  },
};
