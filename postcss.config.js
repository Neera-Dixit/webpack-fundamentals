module.exports = {
  parser: 'postcss-scss',
  plugins: {
    'postcss-mixins': {},
    'postcss-simple-vars': {},
    'postcss-nesting': {},
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: ['last 2 versions', '> 5%'],
    },
  },
};
