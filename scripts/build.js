const buildHooks = require('./build-hooks');
const buildTavern = require('./build-tavern');

console.log('☢️  warming up esbuild...');

const formats = [
  {format: 'cjs', target: 'es6', minify: false},
  {format: 'cjs', target: 'es6', minify: true},
  {format: 'esm', target: 'esnext', minify: false}
];

formats.forEach(({format, target, minify}) => {
  buildTavern(format, target, minify);
});

buildHooks();
