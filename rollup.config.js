// -----------------------------------------------------------------------------

import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

// -----------------------------------------------------------------------------

const NAME = 'hookstores';

// -----------------------------------------------------------------------------

const common = {
  input: 'src/index.js',
  plugins: [
    resolve({
      moduleDirectories: ['node_modules']
    }),
    babel({babelHelpers: 'bundled'})
  ],
  external: ['react']
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
      format: 'cjs'
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
