import gulp from 'gulp';
import jshint from 'gulp-jshint';
import stylish from 'jshint-stylish';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import sass from 'gulp-sass';

const SCRIPTS_DIR = 'resources/assets/scripts';
const STYLES_DIR = 'resources/assets/sass';

// Lint javascript files
gulp.task('lint', () => {
  return gulp.src(SCRIPTS_DIR+'/**/*.js')
    .pipe(jshint())
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
  gulp.src(STYLES_DIR+'/**/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', () => gulp.watch('**/*.js', ['lint', 'browserify', 'sass']));