var tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    require('postcss-import'),
    tailwindcss('./tailwind.config.js'),
    require('cssnano')({
      preset: 'default',
    }),
  ],
};
