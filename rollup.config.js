// -----------------------------------------------------------------------------
// Rollup config from https://github.com/ReactTraining/react-router/blob/master/packages/react-router-dom/rollup.config.js
// -----------------------------------------------------------------------------

const path = require('path');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');

const pkg = require('./package.json');
const NAME = 'hookstores';

function isBareModuleId(id) {
  return (
    !id.startsWith('.') && !id.includes(path.join(process.cwd(), 'modules'))
  );
}

const cjs = [
  {
    input: 'src/index.js',
    output: {
      file: `dist/cjs/${NAME}.js`,
      sourcemap: true,
      format: 'cjs',
      esModule: false
    },
    external: isBareModuleId,
    plugins: [
      babel({exclude: /node_modules/, sourceMaps: true, rootMode: 'upward'}),
      replace({'process.env.NODE_ENV': JSON.stringify('development')})
    ]
  },
  {
    input: 'src/index.js',
    output: {
      file: `dist/cjs/${NAME}.min.js`,
      sourcemap: true,
      format: 'cjs'
    },
    external: isBareModuleId,
    plugins: [
      babel({exclude: /node_modules/, sourceMaps: true, rootMode: 'upward'}),
      replace({'process.env.NODE_ENV': JSON.stringify('production')})
      // uglify()
    ]
  }
];

const esm = [
  {
    input: 'src/index.js',
    output: {file: `dist/esm/${NAME}.js`, sourcemap: true, format: 'esm'},
    external: isBareModuleId,
    plugins: [
      babel({
        exclude: /node_modules/,
        runtimeHelpers: true,
        sourceMaps: true,
        plugins: [['@babel/transform-runtime', {useESModules: true}]],
        rootMode: 'upward'
      })
    ]
  }
];

let config;
switch (process.env.BUILD_ENV) {
  case 'cjs':
    config = cjs;
    break;
  case 'esm':
    config = esm;
    break;
  default:
    config = cjs.concat(esm);
}

module.exports = config;
