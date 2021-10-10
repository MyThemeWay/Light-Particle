/*!
 * webpack.config.js
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2020 sitdisch
 *
 */

const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const jekyllCmd = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';
const { emptyDirSync, ensureDirSync } = require('fs-extra');
const { spawn, fork } = require('child_process');
const { resolve } = require('path');
const { watch } = require('chokidar');

var projectLog = '';

// ASSETS CLEARING
emptyDirSync('./docs/assets');
console.log("[\x1b[90mfs-extra\x1b[0m]: Assets \x1b[1;32m[cleaned]\x1b[0m");

// FILES COPYING
spawn('node',['copyfiles.mjs'], {stdio: 'inherit'})
  .on('spawn', () => {
    console.log("[\x1b[90mnode\x1b[0m]: Starting async `\x1b[36mexec\x1b[0m` of \x1b[35mcopyfiles.mjs\x1b[0m...");
  })
  .on('close', () => {
    console.log("[\x1b[90mnode\x1b[0m]: `\x1b[36mexec\x1b[0m` of \x1b[35mcopyfiles.mjs\x1b[0m \x1b[1;32m[finished]\x1b[0m"+projectLog);
  })
;

// FUNCTIONS
async function jekyllBuild(jekyllSubCmds) {
  spawn(jekyllCmd, jekyllSubCmds, {stdio: 'inherit'})
    .on('spawn', () => {
      console.log("[\x1b[90mjekyll\x1b[0m]: Starting async `\x1b[36mbuild-process\x1b[0m`...");
    })
    .on('close', () => {
      console.log("[\x1b[90mjekyll\x1b[0m]: `\x1b[36mbuild-process\x1b[0m` \x1b[1;32m[finished]\x1b[0m"+projectLog);
    })
  ;
};

// 
// WEBPACK SECTION
// 

var config = {
  entry: {
    main: './index.js',
    style: './src/styles/main.scss',
    bootstrap: './src/styles/bootstrap.scss',
  },
  output: {
    path: resolve(__dirname, './docs/assets'),
    filename: 'js/[name].bundle.min.js',
  },
  devServer: {
    static: [
      {
        directory: './docs',
        watch: {
          watchContentBase: true,
          watchOptions: {
            aggregateTimeout: 100,
          },
        },
      },
    ],
    devMiddleware: {
      writeToDisk: true,
    },
    onListening: (devServer) => {
      const watcherConfig = fork('watcher.config.mjs', [""], {stdio: 'inherit'})
        .on('spawn', () => {
          console.log("[\x1b[90mnode\x1b[0m]: Starting async `\x1b[36mexec\x1b[0m` of \x1b[35mwatcher.config.mjs\x1b[0m...");
        })
      ;
      devServer.compiler.hooks.afterDone.tap('compLog', () => {
        console.log("[\x1b[90mwebpack\x1b[0m]: Starting `\x1b[36mcompile-process\x1b[0m`...");
        if (!(projectLog)) {
          projectLog = "[\x1b[90mwebpack\x1b[0m]: Server is still running...\n    Server Address: \x1b[1;36mhttp://localhost:"+devServer.server.address().port+"/\x1b[0m\n\t   Restart: insert \x1b[35mrs\x1b[0m and hit \x1b[35m<CR>\x1b[0m\n\t      Exit: press \x1b[35mctrl-c\x1b[0m";
          watcherConfig.send(projectLog);
        };
        setTimeout( () => { console.log(projectLog); }, 100);
      });
      ensureDirSync('./docs/assets/img');
      watch('./docs/assets/img/*', {ignoreInitial: true})
        .on('all', () => {
          for (const ws of devServer.webSocketServer.clients) {
            ws.send('{"type": "static-changed"}')
          }
        })
      ;
    },
  },
  plugins: [
    new MiniCssExtractPlugin( { filename: "css/[name].min.css" }),
    new IgnoreEmitPlugin([ /bootstrap.bundle.min.js$/, /style.bundle.min.js$/ ]),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    };
    jekyllBuild(['build']);
    spawn('node',['watcher.config.mjs', '1'], {stdio: 'inherit'})
      .on('spawn', () => {
        console.log("[\x1b[90mnode\x1b[0m]: Starting async `\x1b[36mexec\x1b[0m` of \x1b[35mwatcher.config.mjs\x1b[0m...");
      })
      .on('close', () => {
        console.log("[\x1b[90mnode\x1b[0m]: `\x1b[36mexec\x1b[0m` of \x1b[35mwatcher.config.mjs\x1b[0m \x1b[1;32m[finished]\x1b[0m");
      })
    ;
  } else {
    jekyllBuild(['build', '--config', '_config.yml,_config_dev.yml']);
  };
  return config;
};
