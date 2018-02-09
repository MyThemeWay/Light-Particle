var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var merge = require('merge-stream');
var cp = require('child_process');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/**
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 **/
gulp.task('jekyll-build', function (done) {
    return cp.spawn(jekyllCommand, ['build'], {stdio: 'inherit'})
	      .on('close', done);
});

/**
 * Rebuild Jekyll & reload page
 **/
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

/**
 * Build the jekyll site and launch browser-sync
 **/
gulp.task('browser-sync', ['jekyll-build'], function() {
      browserSync({
	server: {
		  baseDir: '_site'
		}
      });
});

/**
 * Compile and minify sass
 **/
gulp.task('sass', function() {
  return gulp.src('src/styles/**/*.scss')
              .pipe(plumber())
              .pipe(sass())
              .pipe(csso())
              .pipe(gulp.dest('assets/css/'));
});

/**
 * Compile fonts
 **/
gulp.task('fonts', function() {
  return gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
	      .pipe(plumber())
	      .pipe(gulp.dest('assets/fonts/'));
})

/**
 * Minify images
 **/
gulp.task('imagemin', function() {
  var min = gulp.src('src/img/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'));
  var icon = gulp.src('src/img/icon/*')
                .pipe(plumber())
                .pipe(gulp.dest('assets/img/icon/'));
  var texture = gulp.src('src/img/texture/*')
                .pipe(plumber())
                .pipe(gulp.dest('assets/img/texture/'));

  return merge(min, icon, texture);
});

/**
 * Browserify and uglify main site JS
 **/
gulp.task('brow:main', function() {
  return browserify({entries: ['./src/js/main.js'],
                    cache: {},
                    packageCache: {}
          })
          .bundle()
          .pipe(source('main.bundle.js'))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(gulp.dest('assets/js/'));
});

gulp.task('watch:main', function() {
  var bundler = watchify(browserify({
                    entries: ['./src/js/main.js'],
                    cache: {},
                    packageCache: {}
                }));
  bundler.on('update', rebundle);
  function rebundle() {
    return bundler.bundle()
                  .pipe(source('main.bundle.js'))
                  .pipe(buffer())
                  .pipe(uglify())
                  .pipe(gulp.dest('assets/js/'));
  }
  return rebundle();
});

/**
 * Browserify with transform for shader loading
 **/
gulp.task('brow:cym', function() {
  return browserify({entries: ['./src/js/cymatria.js'],
                    cache: {},
                    packageCache: {}
          })
          .transform('browserify-shader')
          .bundle()
          .pipe(source('cymatria.bundle.js'))
          .pipe(buffer())
          .pipe(uglify())
          .pipe(gulp.dest('assets/js/'));
});

gulp.task('watch:cym', function() {
  var bundler = watchify(browserify({entries: ['./src/js/cymatria.js'],
                    cache: {},
                    packageCache: {}
          }));
  bundler.transform('browserify-shader');
  bundler.on('update', rebundle);
  function rebundle(){
    return bundler.bundle()
                  .pipe(source('cymatria.bundle.js'))
                  .pipe(buffer())
                  .pipe(uglify())
                  .pipe(gulp.dest('assets/js/'));
  }
  return rebundle();
});

/**
 * Move audio to /assets
 */
gulp.task('move-audio', function(){
        return gulp.src(['src/audio/sample.mp3']).pipe(gulp.dest('assets/audio/'))
});

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['sass', 'jekyll-rebuild']);
  gulp.watch(['src/js/*.js', 'src/shaders/*'], ['jekyll-rebuild']);
  gulp.watch('src/fonts/**/*.{tff,woff,woff2}', ['fonts']);
  gulp.watch('src/audio/**/*.{mp3,ogg,wav}',['move-audio']);
  gulp.watch('src/img/**/.{jpg,png,gif}', ['imagemin', 'jekyll-rebuild']);
  gulp.watch(['*html', '_includes/*html', '_layouts/*.html', '_posts/*', '_data/*'], ['jekyll-rebuild']);
});

gulp.task('default', [
  'brow:main',
  'brow:cym',
  'imagemin',
  'move-audio', 
  'sass', 'fonts', 
  'browser-sync', 'watch', 'watch:cym', 'watch:main']);
