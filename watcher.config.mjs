/*!
 * watcher.config.mjs
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2021 sitdisch
 *
 */

//
// SECTION: GENERAL THINGS
//

import { argv } from 'process';
import { watch } from 'chokidar';
import { spawn } from 'child_process';
import { stat } from 'fs';
import { remove,  copy, emptyDirSync } from 'fs-extra';
import { basename } from 'path';

const targetDirImg = './docs/assets/img/';
var projectLog = '';

async function logSizeTxt(plugin,fileName,statsBefore) {
  stat(targetDirImg+fileName, (err, statsAfter) => {
    const percent = Math.round((statsAfter.size/statsBefore.size-1)*100);
    var logTxt = '';
    if (percent < 0) {
      logTxt = '\x1b[1;32m'+percent+'%\x1b[0m)\x1b[1;33m [minimized]';
    } else {
      logTxt = '\x1b[1;31m+'+percent+'%\x1b[0m)\x1b[1;31m [NOT MINIMIZED]';
    };
    console.log('[\x1b[90m'+plugin+'\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m (size: '+logTxt+' \x1b[1;32m[added]\x1b[0m'+projectLog);
  });
}

//
// SECTION: SQUOOSH FOR JPG AND PNG
//

// Consider:
// - Squoosh is used by default to minimize jpg and png
// - imagemin is better & faster, but has some unresolved vulnerabilities

// Options: https://github.com/GoogleChromeLabs/squoosh/tree/dev/cli

const watcherSquooshJpg = watch('./src/img/*.jpg');
const watcherSquooshPng = watch('./src/img/*.png');

watcherSquooshJpg.on('all', (event,path,statsBefore) => {
  const fileName = basename(path);
  if (( event === 'add' ) || ( event === 'change' )) {
    const cp = spawn('npx',['@squoosh/cli', '--mozjpeg', '{ quality: 65 }', path, '--output-dir', targetDirImg], {stdio: 'pipe'})
     .on('exit', (code) => {
       if (code === 0) {
         logSizeTxt('squoosh', fileName, statsBefore);
       } else {
         cp.stderr.on('data', (data) => { 
           console.log('[\x1b[90msquoosh\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;31m[ERROR]\x1b[0m\n'+data.toString().replace(/\n$/,"")+projectLog)
         });
       };
     });
  } else if ( event === 'unlink' ) {
    remove(targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[removed]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  };
});

watcherSquooshPng.on('all', (event,path,statsBefore) => {
  const fileName = basename(path);
  if (( event === 'add' ) || ( event === 'change' )) {
    const cp = spawn('npx',['@squoosh/cli', '--oxipng', '{ level: 3 }', path, '--output-dir', targetDirImg], {stdio: 'pipe'})
     .on('exit', (code) => {
       if (code === 0) {
         logSizeTxt('squoosh', fileName, statsBefore);
       } else {
         cp.stderr.on('data', (data) => { 
           console.log('[\x1b[90msquoosh\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;31m[ERROR]\x1b[0m\n'+data.toString().replace(/\n$/,"")+projectLog)
         });
       };
     });
  } else if ( event === 'unlink' ) {
    remove(targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[removed]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  };
});

//
// SECTION: IMAGEMIN FOR SVG AND GIF
//

// Consider:
// - some plugins are deactivated due to unresolved vulnerabilities
// - instead, Squoosh is used by default to minimize jpg and png
// - to use the imagemin plugins, add them to package.json as well

// Options: https://github.com/imagemin/imagemin

// Check Vulnerabilities:
// - https://snyk.io/test/npm/imagemin-gifsicle
// - https://snyk.io/test/npm/imagemin-mozjpeg
// - https://snyk.io/test/npm/imagemin-pngquant

import imagemin from 'imagemin';
import imageminSvgo from 'imagemin-svgo';
// import imageminGifsicle from 'imagemin-gifsicle';
// import imageminMozjpeg from 'imagemin-mozjpeg';
// import imageminPngquant from 'imagemin-pngquant';

const watcherImagemin = watch('./src/img/*.{svg,gif}');
// const watcherImagemin = watch('src/img/*.{svg,gif,jpg,jpeg,png}');

async function imgMin(path) {
  await imagemin([path], {
    destination: targetDirImg,
    glob: false,
    plugins: [
      // imageminGifsicle({ optimizationLevel: 7, interlaced: false }),
      // imageminMozjpeg({ quality: 65 }),
      // imageminPngquant({ quality: [0.65, 0.90], speed: 4 }),
      imageminSvgo({
        plugins: [{
          name: 'preset-default',
          params: {
            overrides: {
              addAttributesToSVGElement: {
                attributes: [{ xmlns: "http://www.w3.org/2000/svg" }],
              },
              removeViewBox: false,
              removeEmptyAttrs: false,
            },
          },
        }]
      })
    ]
  });
};

watcherImagemin.on('all', (event,path,statsBefore) => {
  const fileName = basename(path);
  if (( event === 'add' ) || ( event === 'change' )) {
    imgMin(path)
      .then( () =>  {
        logSizeTxt('imagemin', fileName, statsBefore);
      })
      .catch(err => console.error(err))
    ;
  } else if ( event === 'unlink' ) {
    remove(targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[removed]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  };
});

//
// SECTION: OTHER FILES OF IMG FOLDER
//

const watcherImgOther = watch('./src/img/*.!({svg,gif,jpg,jpeg,png})');

watcherImgOther.on('all', (event,path) => {
  const fileName = basename(path);
  if ( event === 'add' ) {
    copy(path, targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[added]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  } else if ( event === 'change' ) {
    copy(path, targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[changed]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  } else if ( event === 'unlink' ) {
    remove(targetDirImg+fileName)
      .then( () => console.log('[\x1b[90mfs-extra\x1b[0m]: \x1b[35m'+fileName+'\x1b[0m \x1b[1;32m[removed]\x1b[0m'+projectLog))
      .catch(err => console.error(err))
    ;
  };
});

//
// SECTION: COPYFILES.MJS
//

const watcherCopyMjs = watch('copyfiles.mjs', {
  ignoreInitial: true,
  followSymlinks: false
});

watcherCopyMjs.on('change', (path) => {
  emptyDirSync('./docs/assets/lib');
  spawn('node',[path], {stdio: 'inherit'})
    .on('spawn', () => {
      console.log("[\x1b[90mnode\x1b[0m]: Starting async `\x1b[36mexec\x1b[0m` of \x1b[35m"+path+"\x1b[0m...");
    })
    .on('close', () => {
      console.log("[\x1b[90mnode\x1b[0m]: `\x1b[36mexec\x1b[0m` of \x1b[35m"+path+"\x1b[0m \x1b[1;32m[finished]\x1b[0m"+projectLog);
    })
  ;
});

//
// SECTION: JEKYLL BUILD
//

const jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';
const watcherJekyll = watch(['*html', '_includes/*html', '_layouts/*.html', '_posts/*.md', '_config*.yml'], {
  ignoreInitial: true,
});
watcherJekyll.on('all', () => {
  spawn(jekyllCommand, ['build', '--config', '_config.yml,_config_dev.yml'], {stdio: 'inherit'})
    .on('spawn', () => {
      console.log("[\x1b[90mjekyll\x1b[0m]: Starting async `\x1b[36mbuild-process\x1b[0m`...");
    })
    .on('error', (err) => {
      console.log("[\x1b[90mjekyll\x1b[0m]: `\x1b[36mbuild-process\x1b[0m` \x1b[1;31m[ERROR]\x1b[0m\n");
      throw err;
    })
    .on('close', () => {
      console.log("[\x1b[90mjekyll\x1b[0m]: `\x1b[36mbuild-process\x1b[0m` \x1b[1;32m[finished]\x1b[0m"+projectLog);
    })
  ;
});

//
// SECTION: DISTINCTION DEVELOP- OR PRODUCTION-MODE
//

if (argv[2]) {
  watcherCopyMjs.close();
  watcherJekyll.close();
  watcherSquooshJpg.on('ready', () => watcherSquooshJpg.close());
  watcherSquooshPng.on('ready', () => watcherSquooshPng.close());
  watcherImagemin.on('ready', () => watcherImagemin.close());
  watcherImgOther.on('ready', () => watcherImgOther.close());
} else {
  process.on('message', (log) => { projectLog = "\n"+log });
};
