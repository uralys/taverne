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

const buildTavern = (format, target, minify) => {
  const outfile = `${DIST}/${format}/${bundleName}${minify ? '.min' : ''}.js`;

  esbuild
    .build({
      banner: {js: banner},
      format,
      target,
      minify,
      entryPoints: ['src/taverne/index.js'],
      bundle: true,
      sourcemap: true,
      metafile: true,
      outfile,
      external: ['immer'],
      loader: {'.js': 'jsx'},
      define: {
        'process.env.NODE_ENV': '"production"'
      }
    })
    .then(result => {
      console.log(`${chalk.green(' ✔ Success')}`);
      const nbBytes = result.metafile.outputs[`${outfile}`].bytes;

      console.log(
        `   ${chalk.cyan('→')} ${chalk
          .hex('#D07CFF')
          .bold(`${outfile}`)} (${nbBytes})`
      );
    })
    .catch(e => {
      console.log(e);
      process.exit(1);
    });
};

module.exports = buildTavern;
