'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    header = require('gulp-header'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    rimraf = require('gulp-rimraf'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    plumber = require('gulp-plumber');

var sassPaths = [
    './node_modules/foundation-sites/scss',
    './node_modules/motion-ui/src',
    './node_modules/slick-carousel/slick/',
    './node_modules/@fancyapps/fancybox/dist/'
];

var path = {
    dist: {
        html: 'dist/',
        js: 'dist/js/',
        css: 'dist/css/',
        images: 'dist/images/',
        i: 'dist/i/',
        fonts: 'dist/fonts/'
    },
    src: {
        html: 'src/pug/*.pug',
        js: 'src/js/*.js',
        jsLib: [
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/foundation-sites/dist/js/foundation.min.js',
            'node_modules/slick-carousel/slick/slick.min.js',
            'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.min.js',
            'node_modules/@fortawesome/fontawesome/index.js',
            'node_modules/@fortawesome/fontawesome-free-solid/index.js',
            'node_modules/@fortawesome/fontawesome-free-regular/index.js',
            'node_modules/@fortawesome/fontawesome-free-brands/index.js'
        ],
        css: ['src/scss/style.scss'],
        images: 'src/images/**/*.*',
        i: 'src/i/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: ['src/pug/**/*.pug'],
        js: ['src/js/**/*.js'],
        css: 'src/scss/**/*.scss',
        images: 'src/images/**/*.*',
        i: 'src/i/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }
};

gulp.task('clean-css', function() {
    return gulp.src(path.dist.css, {read: false}).pipe(rimraf());
});

gulp.task('clean-html', function() {
    return gulp.src(path.dist.html + '*.html', {read: false}).pipe(rimraf());
});

gulp.task('clean-images', function() {
    return gulp.src(path.dist.images, {read: false}).pipe(rimraf());
});

gulp.task('clean-i', function() {
    return gulp.src(path.dist.i, {read: false}).pipe(rimraf());
});

gulp.task('clean-fonts', function() {
    return gulp.src(path.dist.fonts, {read: false}).pipe(rimraf());
});

gulp.task('clean-js', function() {
    return gulp.src(path.dist.js, {read: false}).pipe(rimraf());
});

var sassFunc = function (minify) {
    return gulp.src(path.src.css)
        .pipe(header((minify ? '$minify: true;\n' : '$minify: false;\n')))
        .pipe(sass({
            includePaths: sassPaths,
            outputStyle: 'compressed'
        })
            .on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(path.dist.css));
};

gulp.task('sass', ['clean-css'], function () { return sassFunc(false); });
gulp.task('sassWatch', function () { return sassFunc(false); });
gulp.task('sassMinify', ['clean-css'], function () { return sassFunc(true); });

var pugFunc = function(minify) {
    return gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(pug({
            pretty: true,
            cache: true,
            locals: {minify: minify}
        }))
        .pipe(gulp.dest(path.dist.html));
};

gulp.task('pug', ['sass', 'clean-html'], function () { return pugFunc(false); });
gulp.task('pugWatch', function () { return pugFunc(false); });
gulp.task('pugMinify', ['clean-html', 'sassMinify'], function () { return pugFunc(true); });

gulp.task('images', ['clean-images'], function () {
    return gulp.src(path.src.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.images));
});

gulp.task('i', ['clean-i'], function() {
    return gulp.src(path.src.i)
        .pipe(gulp.dest(path.dist.i));
});

gulp.task('fonts', ['clean-fonts'], function() {
    return gulp.src([path.src.fonts])
        .pipe(gulp.dest(path.dist.fonts));
});

gulp.task('js-lib', ['clean-js'], function () {
    return gulp.src(path.src.jsLib)
        .pipe(uglify())
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(path.dist.js));
});

var jsApp = function () {
    return gulp.src(path.src.js)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.dist.js));
};

gulp.task('js-app-init', ['clean-js'], jsApp);
gulp.task('js-app', jsApp);

gulp.task('js-app-minify', ['clean-js'], function () {
    return gulp.src(path.src.js)
        .pipe(uglify())
        .pipe(concat('app.js'))
        .pipe(gulp.dest(path.dist.js));
});

gulp.task('minify', ['sassMinify', 'pugMinify', 'images', 'i', 'fonts', 'js-lib', 'js-app-minify']);

gulp.task('default', ['sass', 'pug', 'images', 'i', 'fonts', 'js-lib', 'js-app-init'], function () {
    gulp.watch([path.watch.css], ['sassWatch']);
    gulp.watch([path.watch.html], ['pugWatch']);
    gulp.watch([path.watch.images], ['images']);
    gulp.watch([path.watch.i], ['i']);
    gulp.watch([path.watch.fonts], ['fonts']);
    gulp.watch([path.watch.js], ['js-app']);
});