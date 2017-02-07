'use strict';

var gulp = require('gulp'),
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
    merge = require('merge-stream'),
    sasslint = require('gulp-sass-lint');

var post = [
    fonts({
        hosted: 'fonts/'
    }),
    autoprefixer({
        browsers: ['last 2 versions']
    }),
    // cssnano({
    //     discardComments: {
    //         removeAll: true
    //     },
    //     minimiseWhitespace: true,
    //     discardDuplicates: true,
    //     colormin: true,
    //     discardOverridden: true,
    //     functionOptimiser: true
    // }),
    // cssnext
];


gulp.task('styles', function () {
    gulp.src('web/css/*.scss')
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss(post))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('web/css'));
});

gulp.task('styles_deploy', function () {
    gulp.src('web/css/*.scss')
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss(post))
        .pipe(gulp.dest('web/css'));
});


gulp.task('images', function () {
    return gulp.src('images/**/*')
        .pipe(imagemin({optimizationLevel: 3, progressive: true, interlaced: true}))
        .pipe(gulp.dest('web/images'))
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
        //.pipe(svgstore()) - commented because Sonassi doesn't allow file_get_contents()
        .pipe(gulp.dest('web/images'));
});


gulp.task('svgimg', function () {
    return gulp.src('svg/img-*.svg')
        .pipe(svgmin())
        .pipe(cheerio({
            parserOptions: {xmlMode: true}
        }))
        .pipe(gulp.dest('web/images'));
});


gulp.task('scripts', function () {
    return gulp.src('js/**/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('web/js'));
});


gulp.task('watch', function () {
    gulp.watch('svg/*.svg', ['svgsprite', 'svgimg']);
    gulp.watch('images/**/*', ['images']);
    gulp.watch(['**/*.scss','!node_modules/**'], ['styles']);
    gulp.watch('js/**/*.js', ['scripts']);
});


gulp.task('build', ['styles', 'scripts', 'svgsprite', 'svgimg', 'images']);

gulp.task('deploy', ['styles_deploy', 'scripts', 'svgsprite', 'svgimg', 'images']);