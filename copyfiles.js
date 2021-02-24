/*!
 * copyfiles.js
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2020 sitdisch
 *
 */

const fs = require('fs-extra');

const copyfiles = [
  {
    name: 'Devicon',
    source: './node_modules/devicon',
    files: ['devicon.min.css', 'LICENSE', 'fonts'],
    target: './docs/assets/lib/devicon'
  },
  {
    name: 'Fontawesome',
    source: './node_modules/@fortawesome/fontawesome-free',
    files: ['LICENSE.txt', 'css/all.min.css', 'css/v4-shims.min.css', 'webfonts'],
    target: './docs/assets/lib/fontawesome'
  },
  {
    name: 'Google-Webfonts',
    source: './src/lib/google-webfonts',
    files: ['font-rubik.css', 'font-files'],
    target: './docs/assets/lib/google-webfonts'
  },
  {
    name: 'Jquery',
    source: './node_modules/jquery',
    files: ['/dist/jquery.min.js', 'LICENSE.txt'],
    target: './docs/assets/lib/jquery'
  },
  {
    name: 'Bootstrap',
    source: './node_modules/bootstrap/',
    files: ['/dist/js/bootstrap.bundle.min.js', '/dist/js/bootstrap.bundle.min.js.map', 'LICENSE'],
    target: './docs/assets/lib/bootstrap'
  },
];

copyfiles.forEach(copyfile => {
  var log = false;
  copyfile.files.forEach(file => {
    try {
      fs.copySync(`${copyfile.source}/${file}`, `${copyfile.target}/${file}`, { overwrite: false, errorOnExist: true });
      log = true;
    } catch {}
  });
  if (log === true) {
    console.log('[\x1b[90mfs-extra\x1b[0m]:', copyfile.name, '\x1b[1;92m[copied]\x1b[0m');
  }
});

console.log("[\x1b[90mfs-extra\x1b[0m]: Finished `\x1b[36mfs-extra\x1b[0m`");
