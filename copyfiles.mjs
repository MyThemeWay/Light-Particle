/*!
 * copyfiles.mjs
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2021 sitdisch
 *
 */

import { copy } from 'fs-extra';

const copyfiles = [
  {
    source: './node_modules/devicon',
    files: ['devicon.min.css', 'LICENSE', 'fonts'],
    target: './docs/assets/lib/devicon'
  },
  {
    source: './node_modules/@fortawesome/fontawesome-free',
    files: ['LICENSE.txt', 'css/all.min.css', 'css/v4-shims.min.css', 'webfonts'],
    target: './docs/assets/lib/fontawesome'
  },
  {
    source: './src/lib/google-webfonts',
    files: ['font-rubik.css', 'font-files'],
    target: './docs/assets/lib/google-webfonts'
  },
  {
    source: './node_modules/jquery',
    files: ['/dist/jquery.min.js', 'LICENSE.txt'],
    target: './docs/assets/lib/jquery'
  },
  {
    source: './node_modules/bootstrap/',
    files: ['/dist/js/bootstrap.bundle.min.js', '/dist/js/bootstrap.bundle.min.js.map', 'LICENSE'],
    target: './docs/assets/lib/bootstrap'
  }
];

copyfiles.forEach(copyfile => {
  copyfile.files.forEach(file => {
    copy(`${copyfile.source}/${file}`, `${copyfile.target}/${file}`)
      .catch(err => console.error(err))
  });
});
