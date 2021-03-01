const buildHooks = require('./build-hooks');
const buildTavern = require('./build-tavern');

console.log('☢️  warming up esbuild...');

const formats = [
  {format: 'cjs', minify: false},
  {format: 'cjs', minify: true},
  {format: 'esm', minify: false}
];

formats.forEach(({format, minify}) => {
  buildTavern(format, minify);
});

buildHooks();
