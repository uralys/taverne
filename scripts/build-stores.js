const pkg = require('../package.json');
const chalk = require('chalk');
const esbuild = require('esbuild');

const DIST = 'dist';
const bundleName = 'taverne';

const banner = `/**
 * ⛵ La Taverne v${pkg.version}
 * (c) Uralys, Christophe Dugne-Esquevin
 * https://github.com/uralys/taverne
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
 */
`;

const buildStores = (format, minify) => {
  const outfile = `${DIST}/${format}/${bundleName}${minify ? '.min' : ''}.js`;
  const metafile = `${DIST}/meta/meta-${format}${minify ? '-min' : ''}.json`;

  esbuild
    .build({
      banner,
      format,
      minify,
      entryPoints: ['src/stores/create-stores.js'],
      bundle: true,
      sourcemap: true,
      metafile,
      outfile,
      external: ['immer'],
      loader: {'.js': 'jsx'},
      define: {
        'process.env.NODE_ENV': '"production"'
      }
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
};

module.exports = buildStores;
