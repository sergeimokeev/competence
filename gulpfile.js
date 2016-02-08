'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');

var sassPaths = [
    './bower_components/foundation-sites/scss',
    './bower_components/motion-ui/src',
    './bower_components/components-font-awesome/scss/'
];

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        images: 'dist/images/',
        fonts: 'dist/fonts/',
        awesome: 'dist/fonts/'
    },
    src: {
        html: 'src/jade/*.jade',
        js: 'src/js/main.js',
        css: 'src/scss/style.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        awesome: 'bower_components/components-font-awesome/fonts/**/*.*'
    },
    watch: {
        html: 'src/jade/**/*.jade',
        js: 'src/js/**/*.js',
        css: 'src/scss/**/*.scss',
        images: 'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*',
        awesome: 'bower_components/components-font-awesome/fonts/**/*.*'
    }
};

gulp.task('sass', function () {
    return gulp.src(path.src.css)
        .pipe(sass({
                includePaths: sassPaths,
                outputStyle: 'compressed'
            })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9']
        }))
        .pipe(gulp.dest(path.dist.css));
});

gulp.task('jade', function() {
    gulp.src(path.src.html)
        .pipe(jade({
            pretty: true
        }))
        .pipe(gulp.dest(path.dist.html))
});

gulp.task('images', function () {
    gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.images));
});

gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('awesome', function() {
    gulp.src(path.src.awesome)
        .pipe(gulp.dest(path.dist.awesome))
});

gulp.task('default', ['sass', 'jade', 'images', 'fonts', 'awesome'], function () {
    gulp.watch([path.watch.css], ['sass']);
    gulp.watch([path.watch.html], ['jade']);
    gulp.watch([path.watch.images], ['images']);
    gulp.watch([path.watch.fonts], ['fonts']);
    gulp.watch([path.watch.awesome], ['awesome']);
});

//https://gist.github.com/Insayt/272c9b81936a03884768
//https://gist.github.com/Deraen/9488df411b61fbe6c831
//https://habrahabr.ru/post/250569/
//https://blog.engineyard.com/2014/frontend-dependencies-management-part-2