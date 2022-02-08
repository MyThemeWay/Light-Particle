/*! LIGHT-PARTICLE: CANVAS.CONFIG.JS
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright © 2021 sitdisch
 */

// 
// SECTION: PATH TO CANVAS (p2c) IN USE
// 

// const p2c = './src/canvas/mtw-canvas-disks';
const p2c = './src/canvas/mtw-canvas-malachite';

// 
// SECTION: LOADING MODULES
// 

const TerserPlugin = require('terser-webpack-plugin');
const prepr = require('prepr');
const { remove, readFileSync, writeFileSync } = require('fs-extra');
const { spawnSync } = require('child_process');
const { resolve } = require('path');
const { watch } = require('chokidar');

// 
// SECTION: GLSL-PREPROCESS
// 

function glsl(devMode) {
  writeFileSync(`${p2c}/shaders.prepr.glslx`, prepr(readFileSync(`${p2c}/shaders.glslx`, "utf8")));
  var glslxCmd = ['glslx', `${p2c}/shaders.prepr.glslx`, `--output=${p2c}/shaders.glslx.min.js`, '--format=js' ];
  if (devMode) {
    glslxCmd.push('--pretty-print', '--disable-rewriting', '--renaming=none');
  }
  const cp = spawnSync('npx', glslxCmd, {stdio: 'inherit'});
  if (cp.status != 0) {
    console.log("\x1b[1;31m[ERROR]\x1b[0m => \x1b[0m[\x1b[90mwebpack\x1b[0m]: `\x1b[36mcanvas-glsl-preprocess\x1b[0m` \x1b[1;31m[failed]\x1b[0m");
    remove(`${p2c}/shaders.glslx.min.js`);
  };
  remove(`${p2c}/shaders.prepr.glslx`);
}

// 
// SECTION: WEBPACK
// 

var config = {
  entry: { canvas: `${p2c}/main.js` },
  output: {
    path: resolve(__dirname, './docs/assets'),
    filename: 'js/[name].bundle.min.js',
  },
  stats: { modules: false },
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin()],
    };
    glsl();
  } else {
    config.devServer = {
      host: 'local-ip',
      hot: false,
      liveReload: false,
      magicHtml: false,
      client: {
        logging: 'none',
        overlay: true
      },
      static: false,
      devMiddleware: { writeToDisk: true },
      onListening: () => {
        watch(`${p2c}/shaders.glslx`, {ignoreInitial: true})
          .on('change', () => { glsl(true); })
        ;
      },
    };
    config.infrastructureLogging = { level: 'warn' };
    glsl(true);
  };
  return config;
};
