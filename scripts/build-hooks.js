const pkg = require('../package.json');
const chalk = require('chalk');
const esbuild = require('esbuild');

const DIST = 'dist';

const banner = `/**
 * ⛵ La Taverne v${pkg.version} - hooks
 * (c) Uralys, Christophe Dugne-Esquevin
 * https://github.com/uralys/taverne
 * @license MIT
 *
 * 🔥 BUNDLED with esbuild:
 * https://github.com/evanw/esbuild
 *
 * 💖 DEPENDENCIES:
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

const buildHooks = () => {
  const outfile = `${DIST}/hooks/index.js`;

  esbuild
    .build({
      banner,
      format: 'esm',
      entryPoints: ['src/hooks/context-provider.js'],
      bundle: true,
      outfile,
      loader: {'.js': 'jsx'},
      define: {
        'process.env.NODE_ENV': '"production"'
      },
      external: ['react, deep-equal']
    })
    .then(() => {
      console.log(`${chalk.green(' ✔ Success')}`);

      console.log(
        `   ${chalk.cyan('→')} ${chalk.hex('#D07CFF').bold(`${outfile}`)}`
      );
    })
    .catch(() => process.exit(1));
};

module.exports = buildHooks;
