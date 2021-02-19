// -----------------------------------------------------------------------------

import babel from '@rollup/plugin-babel';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import {terser} from 'rollup-plugin-terser';
import license from 'rollup-plugin-license';

// -----------------------------------------------------------------------------

import pkg from './package.json';

// -----------------------------------------------------------------------------

const NAME = 'hookstores';
const banner = `
  hookstores v${pkg.version}
  (c) Uralys, Christophe Dugne-Esquevin
  https://github.com/uralys/hookstores
  @license MIT

  immer
  (c) 2017 Michel Weststrate
  https://github.com/immerjs/immer
  @license MIT

  React
  (c) Facebook, Inc. and its affiliates.
  https://github.com/facebook/react
  @license MIT

  deep-equal
  (c) 2012, 2013, 2014 James Halliday <mail@substack.net>, 2009 Thomas Robinson <280north.com>
  https://github.com/inspect-js/node-deep-equal
  @license MIT
`;

// -----------------------------------------------------------------------------

const common = {
  input: 'src/index.js',
  plugins: [
    babel({babelHelpers: 'bundled'}),
    nodeResolve({resolveOnly: ['immer']}),
    license({banner})
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

const config = cjs.concat(esm);

// -----------------------------------------------------------------------------

export default config;
