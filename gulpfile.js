/**
 * Created by evgen on 04.11.17.
 */

const gulp = require('gulp'),
    htmlclean = require('gulp-htmlclean'),
    scss = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del'),
    watch = require('gulp-watch');


//сервер
const browserSync = require("browser-sync"),
    reload = browserSync.reload;

gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./build"
        }
    });
});


var path = {
    build: { // пути куда складывать
        html: 'build/',
        css: 'build/css',
        js: 'build/js/',
        img: 'build/img',
        fonts: 'build/fonts/'
    },
    src: { // откуда брать
        html: 'src/*.html',
        css: 'src/css/screen.scss',
        js: ['src/js/jquery.js', 'src/js/*.js'],
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    watch: { // за чем следить
        html: 'src/*.html',
        css: 'src/css/**/*.scss',
        js: 'src/js/**/*.js',
        img: 'src/img/**/*.*',
        font: 'src/fonts/**/*.*'
    },
    clean : '/build'
};

gulp.task('html', function () {
    gulp.src(path.src.html)
        .pipe(htmlclean())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('css', function () {
    gulp.src(path.src.css)
        .pipe(sourcemaps.init())
        .pipe(scss())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('image', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            optipng : {optimizationLevel: 5},
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('clean', function() {
    return del(['build']);
});

gulp.task('build', [
    'html',
    'js',
    'css',
    // 'fonts',
    'image'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image');
    });
    // watch([path.watch.fonts], function(event, cb) {
    //     gulp.start('fonts');
    // });
});

gulp.task('default', ['build', 'server', 'watch'], reload);
