const pkg = require('../package.json');
const chalk = require('chalk');
const esbuild = require('esbuild');

console.log('☢️  warming esbuild...');

const DIST = 'dist';

const banner = `/**
 * ⛵ hookstores v${pkg.version}
 * (c) Uralys, Christophe Dugne-Esquevin
 * https://github.com/uralys/hookstores
 * @license MIT
 *
 * 🔥 BUNDLED with esbuild:
 * https://github.com/evanw/esbuild
 *
 * 💖 DEPENDENCIES:
 *
 * immer
 * (c) 2017 Michel Weststrate
 * https://github.com/immerjs/immer
 * @license MIT
 *
 * React
 * (c) Facebook, Inc. and its affiliates.
 * https://github.com/facebook/react
 * @license MIT
 *
 * deep-equal
 * (c) 2012, 2013, 2014 James Halliday <mail@substack.net>, 2009 Thomas Robinson <280north.com>
 * https://github.com/inspect-js/node-deep-equal
 * @license MIT
 */
`;

const formats = [
  {format: 'cjs', minify: false},
  {format: 'cjs', minify: true},
  {format: 'esm', minify: false}
];

formats.forEach(({format, minify}) => {
  const outfile = `${DIST}/${format}/hookstores${minify ? '.min' : ''}.js`;
  const metafile = `${DIST}/meta/meta-${format}${minify ? '-min' : ''}.json`;

  esbuild
    .build({
      banner,
      format,
      minify,
      entryPoints: ['src/index.js'],
      bundle: true,
      sourcemap: true,
      metafile,
      outfile,
      loader: {'.js': 'jsx'},
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      external: ['react', 'deep-equal']
    })
    .then(() => {
      console.log(`${chalk.green(' ✔ Success')}`);

      console.log(
        `   ${chalk.cyan('→')} ${chalk
          .hex('#D07CFF')
          .bold(`${outfile}`)} ${chalk.cyan('→')} (${chalk.hex('#ffddFd')(
          `${metafile}`
        )})`
      );
    })
    .catch(() => process.exit(1));
});
