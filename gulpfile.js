'use strict';

var
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('autoprefixer'),
    plumber = require('gulp-plumber'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    cssnext = require('postcss-cssnext'),
    fonts = require('postcss-font-magician'),
    notify = require('gulp-notify'),
    svgmin = require('gulp-svgmin'),
    svgstore = require('gulp-svgstore'),
    imagemin = require('gulp-imagemin'),
    cheerio = require('gulp-cheerio'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del'),
    cssnano = require('cssnano'),
    merge = require('merge-stream');

var post = [
    fonts({
        hosted: '../fonts/'
    }),
    autoprefixer,
    cssnano({
        discardComments: {
            removeAll: true
        }
    }),
    cssnext
];

gulp.task('styles', function () {
    gulp.src('./scss/{,*/}*.{scss,sass}')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(post))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message: 'CSS Processed', onLast: true}));
});

gulp.task('images', function () {
    return gulp.src('images/**/*')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('dist/images'))
});

gulp.task('svgsprite', function () {
    gulp.src('svg/icon-*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('style').remove();
            },
            parserOptions: {xmlMode: true}
        }))
        .pipe(svgstore())
        .pipe(gulp.dest('dist/images'));
});

gulp.task('svgimg', function () {
    return gulp.src('svg/img-*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
            parserOptions: {xmlMode: true}
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('scripts', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(notify({message: 'Scripts task complete'}));
});

gulp.task('clean', function () {
    return del(['dist/css', 'dist/js', 'dist/images']);
});

gulp.task('watch', function () {
    gulp.watch('svg/*.svg', ['svgsprite', 'svgimg']);
    gulp.watch('images/**/*', ['images']);
    gulp.watch('./scss/{,*/}*.{scss,sass}', ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);
});

gulp.task('build', ['styles', 'scripts', 'images', 'svgsprite', 'svgimg']);