import gulp from 'gulp';
import sass from 'gulp-sass';
import babelify from 'babelify';
import jshint from 'gulp-jshint';
import browserify from 'browserify';
import stylish from 'jshint-stylish';
import source from 'vinyl-source-stream';

const SCRIPTS_DIR = 'resources/assets/scripts';
const STYLES_DIR = 'resources/assets/sass';

// Lint javascript files
gulp.task('lint', () => {
  return gulp.src(SCRIPTS_DIR+'/**/*.js')
    .pipe(jshint({"esnext": true}))
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail'));
});

gulp.task('browserify', () => {
  return browserify(SCRIPTS_DIR+'/main.js')
    .transform(babelify, { stage: 0 })
    .bundle()
    .on('error', function(e){
        console.log(e.message);
        this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('sass', () => {
  gulp.src(STYLES_DIR+'/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', ['lint', 'browserify', 'sass'], () => {
    gulp.watch(SCRIPTS_DIR+'/**/*.js', ['lint', 'browserify']);
    gulp.watch(STYLES_DIR+'/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);