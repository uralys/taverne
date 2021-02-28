const buildHooks = require('./build-hooks');
const buildStores = require('./build-stores');

console.log('☢️  warming up esbuild...');

const formats = [
  {format: 'cjs', minify: false},
  {format: 'cjs', minify: true},
  {format: 'esm', minify: false}
];

formats.forEach(({format, minify}) => {
  buildStores(format, minify);
});

buildHooks();
