// -----------------------------------------------------------------------------

import babel from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

// -----------------------------------------------------------------------------

import packageJSON from './package.json';

// -----------------------------------------------------------------------------

const NAME = 'hookstores';

// -----------------------------------------------------------------------------

const common = {
  input: 'src/index.js',
  plugins: [
    babel({babelHelpers: 'bundled'}),
    license({
      banner: `
        hookstores v${packageJSON.version}
        (c) Uralys, Christophe Dugne-Esquevin
        @license MIT
    `
    })
  ],
  external: ['react', 'deep-equal']
};

// -----------------------------------------------------------------------------

const cjs = [
  {
    ...common,
    output: {
      file: `dist/cjs/${NAME}.js`,
      sourcemap: true,
      format: 'cjs',
      esModule: false
    }
  },
  {
    ...common,
    output: {
      file: `dist/cjs/${NAME}.min.js`,
      sourcemap: true,
      format: 'cjs',
      plugins: [terser()]
    }
  }
];

const esm = [
  {
    ...common,
    output: {
      file: `dist/esm/${NAME}.js`,
      sourcemap: true,
      format: 'esm'
    }
  }
];

// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------

export default config;
