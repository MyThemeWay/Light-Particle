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
    target: `devicon`
  },
  {
    source: './node_modules/@fortawesome/fontawesome-free',
    files: ['LICENSE.txt', 'css/all.min.css', 'css/v4-shims.min.css', 'webfonts'],
    target: 'fontawesome'
  },
  {
    source: './node_modules/jquery',
    files: ['/dist/jquery.min.js', 'LICENSE.txt'],
    target: 'jquery'
  },
  {
    source: './node_modules/bootstrap/',
    files: ['/dist/js/bootstrap.bundle.min.js', '/dist/js/bootstrap.bundle.min.js.map', 'LICENSE'],
    target: 'bootstrap'
  }
];

copyfiles.forEach(copyfile => {
  copyfile.files.forEach(file => {
    copy(`${copyfile.source}/${file}`, `./docs/assets/lib_c/${copyfile.target}/${file}`)
      .catch(err => console.error(err))
  });
});
