/*!
 * webpack.config.js
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2020 sitdisch
 *
 */

const path = require('path');
const shell = require('shelljs');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const fs = require('fs-extra');

// CLEAR ASSETS FOLDER
console.log("[\x1b[90mwebpack.config\x1b[0m]: Starting `\x1b[36mfs-extra\x1b[0m`...");
fs.emptyDirSync('./docs/assets');
console.log('[\x1b[90mfs-extra\x1b[0m]: Assets \x1b[1;92m[cleaned]\x1b[0m');
// COPY DIFFERENT FILES IN THE ASSETS FOLDER (GULP WATCHES THIS)
require('./copyfiles.js');

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
    path: path.resolve(__dirname, './docs/assets'),
    filename: 'js/[name].bundle.min.js',
  },
  devServer: {
    static: {
      directory: './docs',
      watch: {
        watchContentBase: true,
        watchOptions: {
          aggregateTimeout: 100,
        },
      }
    },
    devMiddleware: {
      writeToDisk: true,
    },
    onAfterSetupMiddleware: function (devServer) {
      shell.exec('bundle exec gulp --silent --color', {async:true});
    },
  },
  plugins: [
    new MiniCssExtractPlugin(
      {
        filename: "css/[name].min.css",
      }
    ),
    new IgnoreEmitPlugin([ /bootstrap.bundle.min.js$/, /style.bundle.min.js$/ ]),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        severityError: "warning", // Ignore errors on corrupted images
        plugins: [
          ["gifsicle", { optimizationLevel: 7, interlaced: false }],
          ["mozjpeg", { quality: 65 }],
          ["pngquant", { quality: [0.65, 0.90], speed: 4 }],
          // Svgo configuration here https://github.com/svg/svgo#configuration
          [
            "svgo",
            {
              plugins: [{
                name: 'preset-default',
                params: {
                  overrides: {
                    // customize options for plugins included in preset
                    addAttributesToSVGElement: {
                      attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
                    },
                    // or disable plugins
                    removeViewBox: false,
                    removeEmptyAttrs: false,
                  },
                },
              }],
            },
          ],
        ],
      },
    }),
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
      {
        include: path.resolve(__dirname, './src/img'),
        type: 'asset/resource',
        generator: {
          filename: 'img/[base]',
        }
      },
    ],
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({}), new CssMinimizerPlugin({})],
    };
  };
  return config;
};
