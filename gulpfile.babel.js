import gulp from 'gulp';
import sass from 'gulp-sass';
import gutil from 'gulp-util';
import babelify from 'babelify';
import jshint from 'gulp-jshint';
import browserify from 'browserify';
import stylish from 'jshint-stylish';
import source from 'vinyl-source-stream';
import autoprefixer from 'gulp-autoprefixer';

const SCRIPTS_DIR = 'resources/assets/scripts';
const STYLES_DIR = 'resources/assets/sass';

/**
 * Handle error reporting
 * @param  object error [description]
 */
function handleError(error){
  gutil.log(gutil.colors.red('Error: ' + error.message));
  this.emit('end');
}

// Lint javascript files
gulp.task('lint', () => {
  return gulp.src(SCRIPTS_DIR+'/**/*.js')
    .pipe(jshint({'esnext': true}))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

// Use ES6 modules in the browser
gulp.task('browserify', () => {
  return browserify(SCRIPTS_DIR+'/main.js')
    .transform(babelify, { stage: 0 })
    .bundle()
    .on('error', handleError)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});

// Compile SASS to regular CSS
gulp.task('sass', () => {
  return gulp.src(STYLES_DIR+'/style.scss')
    .pipe(sass().on('error', handleError))
    .pipe(gulp.dest('./public/css'));
});

// Recompile files when saved
gulp.task('watch', ['lint', 'browserify', 'sass'], () => {
  gulp.watch(SCRIPTS_DIR+'/**/*.js', ['lint', 'browserify']);
  gulp.watch(STYLES_DIR+'/**/*.scss', ['sass']);
});

// Default gulp task
gulp.task('default', ['watch']);