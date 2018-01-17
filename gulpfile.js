var gulp = require('gulp');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var cp = require('child_process');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');

var jekyllCommand = (/^win/.test(process.platform)) ? 'jekyll.bat' : 'jekyll';

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task('jekyll-build', function (done) {
	return cp.spawn(jekyllCommand, ['build'], {stdio: 'inherit'})
		.on('close', done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
	browserSync.reload();
});

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task('browser-sync', ['jekyll-build'], function() {
	browserSync({
		server: {
			baseDir: '_site'
		}
	});
});

/*
* Compile and minify sass
*/
gulp.task('sass', function() {
  gulp.src('src/styles/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest('assets/css/'));
});

/*
* Compile fonts
*/
gulp.task('fonts', function() {
	gulp.src('src/fonts/**/*.{ttf,woff,woff2}')
	.pipe(plumber())
	.pipe(gulp.dest('assets/fonts/'));
})

/*
 * Minify images
 */
gulp.task('imagemin', function() {
	return gulp.src('src/img/**/*.{jpg,png,gif}')
		.pipe(plumber())
		.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest('assets/img/'));
});

/**
 * Compile and minify js
 */
gulp.task('js', function(){
	return gulp.src('src/js/app.js')
		.pipe(plumber())
		.pipe(concat('main.js'))
		.pipe(uglify())
		.pipe(gulp.dest('assets/js/'))
});

gulp.task('cym-js', function(){
        return gulp.src('src/js/cymatria.js')
        .pipe(plumber())
        .pipe(concat('cymatria.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
});
/**
 * Minify raw libraries and concatenate to lib file
 **/
gulp.task('lib-js', function(){
        return gulp.src(['src/js/OrbitControls.js',
          'src/js/PhysicsRenderer.js'])
        .pipe(plumber())
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('assets/js/'))
});

/**
 * Move already minified libraries to /assets
 */
gulp.task('move-js', function(){
	return gulp.src([
          'src/js/three.min.js',
          'src/js/dat.gui.min.js', 
          'src/js/dat.gui.css'])
        .pipe(gulp.dest('assets/js/'))
});

/**
 * Move audio to /assets
 */
gulp.task('move-audio', function(){
        return gulp.src(['src/audio/sample.mp3']).pipe(gulp.dest('assets/audio/'))
});

gulp.task('watch', function() {
  gulp.watch('src/styles/**/*.scss', ['sass', 'jekyll-rebuild']);
  gulp.watch('src/js/app.js', ['js']);
  gulp.watch('src/js/cymatria.js', ['cym-js']);
  gulp.watch('src/js/*.min.js', ['move-js']);
  gulp.watch('src/fonts/**/*.{tff,woff,woff2}', ['fonts']);
  gulp.watch('src/audio/**/*.{mp3,ogg,wav}',['move-audio']);
  gulp.watch('src/img/**/*.{jpg,png,gif}', ['imagemin']);
  gulp.watch(['*html', '_includes/*html', '_layouts/*.html'], ['jekyll-rebuild']);
});

gulp.task('default', [
  'js', 'cym-js', 'lib-js', 'move-js', 
  'move-audio', 
  'sass', 'fonts', 
  'browser-sync', 'watch']);
