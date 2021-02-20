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
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
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
    watchContentBase: true,
    contentBase: './docs',
    writeToDisk: true,
    after: function(app, server, compiler) {
      shell.exec('bundle exec gulp --silent --color', {async:true});
    },
    watchOptions: {
      aggregateTimeout: 100,
    },
  },
  plugins: [
    new MiniCssExtractPlugin(
      {
        filename: "css/[name].min.css",
      }
    ),
    new IgnoreEmitPlugin([ /bootstrap.bundle.min.js$/, /style.bundle.min.js$/ ]),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            }
          },
          {
            loader: 'image-webpack-loader',
          },
        ],
      },
      {
        test: /\.(ico|xml)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            }
          },
        ],
      },
      {
        test: /manifest\.json$/i,
        type: 'javascript/auto',
        include: path.resolve(__dirname, './src/img/icon'),
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
            }
          },
        ],
      },
    ],
  },
}

module.exports = (env, argv) => {
  if (argv.mode === 'production') {
    config.optimization = {
      minimize: true,
      minimizer: [new TerserPlugin({}), new OptimizeCSSAssetsPlugin({})],
    };
  };
  return config;
};
