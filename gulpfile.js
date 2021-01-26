/*!
 * gulpfile.js
 * 
 * Author: sitdisch
 * Source: https://sitdisch.github.io/#mythemeway
 * License: MIT
 * Copyright (c) 2020 sitdisch
 *
 */

var gulp = require('gulp');
var cp = require('child_process');
var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

console.log("[\x1b[90mgulp\x1b[0m]: Using gulpfile\x1b[35m", __filename, "\x1b[0m\n[\x1b[90mgulp\x1b[0m]: Starting `\x1b[36mdefault\x1b[0m`...\n[\x1b[90mgulp\x1b[0m]: Starting `\x1b[36mwatch\x1b[0m`...");

gulp.task('jekyll-build', function (done) {
  console.log("[\x1b[90mgulp\x1b[0m]: Starting `\x1b[36mjekyll-build\x1b[0m`...");
  return cp.spawn(jekyllCommand, ['build', "--baseurl", ""], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('console-log', function (done) {
  console.log("    Server address: \x1b[1;34mhttp://localhost:8080/\x1b[0m\n  Server running... insert \x1b[35mrs\x1b[0m and hit \x1b[35m<CR>\x1b[0m to restart,\n\t\t    press \x1b[35mctrl-c\x1b[0m to stop.");
  done();
});

gulp.task('copyfiles', function (done) {
  console.log("[\x1b[90mgulp\x1b[0m]: Starting '\x1b[36mfs-extra\x1b[0m'...");
  return cp.spawn('node', ['copyfiles.js'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('watch', function() {
  gulp.watch('copyfiles.js', gulp.series('copyfiles'));
  gulp.watch('assets/**/*', {delay:1000}, gulp.series('jekyll-build','console-log'));
  gulp.watch('_config.yml', {delay:500}, gulp.series('jekyll-build','console-log'));
  gulp.watch(['*html', '_includes/*html', '_layouts/*.html', '_posts/*.md'], gulp.series('jekyll-build','console-log'));
});

gulp.task('default', gulp.series('watch'));
